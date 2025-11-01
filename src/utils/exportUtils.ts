import { Team, Question } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (teams: Team[], questions: Question[], round: number, roundName: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(`UXcellence - Round ${round}: ${roundName}`, 14, 20);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
  
  // Prepare table data
  const tableData = teams
    .filter(t => t.round === round)
    .map((team, index) => {
      const question = questions.find(q => q.id === team.assignedQuestionId);
      return [
        index + 1,
        team.name,
        question?.question || 'Not assigned',
        team.marks !== undefined ? team.marks.toString() : 'N/A',
        team.reason || '-'
      ];
    });
  
  // Add table
  autoTable(doc, {
    startY: 35,
    head: [['#', 'Team Name', 'Question', 'Marks', 'Reason']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [147, 51, 234] }, // Purple color
    styles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 40 },
      2: { cellWidth: 60 },
      3: { cellWidth: 20 },
      4: { cellWidth: 50 },
    },
  });
  
  // Save the PDF
  doc.save(`UXcellence_Round${round}_${roundName.replace(/\s+/g, '_')}.pdf`);
};

export const exportToCSV = (teams: Team[], questions: Question[], round: number, roundName: string) => {
  // Prepare CSV header
  const headers = ['#', 'Team Name', 'Question', 'Marks', 'Reason'];
  
  // Prepare CSV rows
  const rows = teams
    .filter(t => t.round === round)
    .map((team, index) => {
      const question = questions.find(q => q.id === team.assignedQuestionId);
      return [
        index + 1,
        team.name,
        question?.question || 'Not assigned',
        team.marks !== undefined ? team.marks : 'N/A',
        team.reason || '-'
      ];
    });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `UXcellence_Round${round}_${roundName.replace(/\s+/g, '_')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (teams: Team[], questions: Question[], round: number, roundName: string) => {
  // For Excel, we'll use the same CSV format but with .xls extension
  // Most spreadsheet apps can open CSV files
  // For true Excel format, you'd need a library like xlsx
  
  const headers = ['#', 'Team Name', 'Question', 'Marks', 'Reason'];
  
  const rows = teams
    .filter(t => t.round === round)
    .map((team, index) => {
      const question = questions.find(q => q.id === team.assignedQuestionId);
      return [
        index + 1,
        team.name,
        question?.question || 'Not assigned',
        team.marks !== undefined ? team.marks : 'N/A',
        team.reason || '-'
      ];
    });
  
  // Create tab-separated content for better Excel compatibility
  const content = [
    headers.join('\t'),
    ...rows.map(row => row.join('\t'))
  ].join('\n');
  
  const blob = new Blob([content], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `UXcellence_Round${round}_${roundName.replace(/\s+/g, '_')}.xls`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
