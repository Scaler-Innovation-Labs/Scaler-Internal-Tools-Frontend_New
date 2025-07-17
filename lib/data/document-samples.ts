// Sample data for document pages
export const sampleDocuments = [
  {
    title: "Academic Calendar 2024-25",
    postedDate: "May 04, 2025",
    fileType: "PDF",
    updatedDate: "June 15, 2025",
    tags: ["#schedule", "#calendar", "#important"],
    badgeType: "Important" as const,
    uploadedBy: "Admin Office"
  },
  {
    title: "Student Handbook",
    postedDate: "April 15, 2025",
    fileType: "DOC",
    updatedDate: "April 20, 2025",
    tags: ["#guidelines", "#rules"],
    badgeType: "Administrative" as const,
    uploadedBy: "Academic Affairs"
  },
  {
    title: "Annual Day Celebration",
    postedDate: "March 30, 2025",
    fileType: "PDF",
    updatedDate: "April 01, 2025",
    tags: ["#celebration", "#cultural"],
    badgeType: "Events" as const,
    uploadedBy: "Events Committee"
  },
];

export const formConfig = {
  fileFormats: ["PDF", "DOC", "DOCX", "TXT"],
  categories: ["Academic", "Events", "Administrative"],
  tags: ["#schedule", "#calendar", "#important", "#guidelines", "#rules", "#celebration", "#cultural"],
  allowedUserRoles: ["All", "Student", "Super Admin", "Admin"],
  allowedUserBatches: ["Batch2023", "Batch2024", "Batch2025", "Batch2026", "Batch2027", "Batch2028"],
  defaultSelected: ["Admin", "Batch2023", "Batch2028"]
}; 