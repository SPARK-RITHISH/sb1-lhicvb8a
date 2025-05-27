import * as XLSX from 'xlsx';
import { AttendanceRecord, Student, Department, AttendanceStatus } from '../types';
import { formatDisplayDate } from './date-utils';

const statusColors = {
  present: { bgColor: { rgb: "C6EFCE" }, fontColor: { rgb: "006100" } },
  absent: { bgColor: { rgb: "FFC7CE" }, fontColor: { rgb: "9C0006" } },
  late: { bgColor: { rgb: "FFEB9C" }, fontColor: { rgb: "9C5700" } },
  excused: { bgColor: { rgb: "DDEBF7" }, fontColor: { rgb: "305496" } }
};

export const exportAttendanceToExcel = (
  records: AttendanceRecord[],
  dateRange: string[],
  department: Department,
  year: string,
  periods: number = 5
) => {
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  
  // Create header rows
  const headerRow1 = ['Student Name', 'Reg Number'];
  const headerRow2 = ['', ''];
  
  // Add date headers for each day and period
  dateRange.forEach(date => {
    for (let p = 1; p <= periods; p++) {
      headerRow1.push(formatDisplayDate(date));
      headerRow2.push(`Period ${p}`);
    }
  });
  
  // Add summary columns
  headerRow1.push('Total', 'Total', 'Total', 'Total');
  headerRow2.push('Present', 'Absent', 'Late', 'Excused');
  
  // Create data rows
  const data = [headerRow1, headerRow2];
  
  records.forEach(record => {
    const row = [record.student.name, record.student.regNumber];
    
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let excusedCount = 0;
    
    // Add attendance status for each day and period
    dateRange.forEach(date => {
      for (let p = 1; p <= periods; p++) {
        const key = `${date}-${p}`;
        const status = record.periods[p] || 'absent';
        row.push(status);
        
        // Count attendance types
        if (status === 'present') presentCount++;
        else if (status === 'absent') absentCount++;
        else if (status === 'late') lateCount++;
        else if (status === 'excused') excusedCount++;
      }
    });
    
    // Add summary counts
    row.push(presentCount, absentCount, lateCount, excusedCount);
    data.push(row);
  });
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);
  
  // Add styles
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  
  for (let R = 2; R <= range.e.r; R++) {
    for (let C = 2; C <= range.e.c - 4; C++) {
      const cell = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cell]) continue;
      
      const status = ws[cell].v as AttendanceStatus;
      if (statusColors[status]) {
        if (!ws[cell].s) ws[cell].s = {};
        ws[cell].s.fill = { fgColor: statusColors[status].bgColor };
        ws[cell].s.font = { color: statusColors[status].fontColor };
      }
    }
  }
  
  // Set column widths
  const colWidth = [{ wch: 30 }, { wch: 15 }];
  for (let i = 2; i <= range.e.c; i++) {
    colWidth.push({ wch: 12 });
  }
  ws['!cols'] = colWidth;
  
  // Add worksheet to workbook
  const sheetName = `${department.name} - ${year}`;
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Generate file name
  const fileName = `Attendance_${department.code}_${year}_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  // Write and download
  XLSX.writeFile(wb, fileName);
};