// Script to identify and fix API errors
const fs = require('fs');
const path = require('path');

// List of API files to check
const apiFiles = [
  'app/api/auth/login/route.ts',
  'app/api/auth/logout/route.ts',
  'app/api/users/route.ts',
  'app/api/users/[id]/route.ts',
  'app/api/members/route.ts',
  'app/api/members/[id]/route.ts',
  'app/api/news/route.ts',
  'app/api/news/[id]/route.ts',
  'app/api/upload/route.ts',
];

console.log('Checking for API errors...\n');

// Function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

// Function to read file content
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    return null;
  }
}

// Check each API file
apiFiles.forEach(filePath => {
  if (fileExists(filePath)) {
    console.log(`✓ ${filePath} exists`);
    
    const content = readFile(filePath);
    if (content) {
      // Check for common issues
      const issues = [];
      
      // Check for error handler imports
      if (content.includes('from "@/lib/error-handler"') && 
          !content.includes('ValidationError') && 
          !content.includes('NotFoundError')) {
        issues.push('Uses error handler but may have import issues');
      }
      
      // Check for soft delete usage
      if (content.includes('SoftDeleteHelper') && 
          content.includes('deletedAt')) {
        issues.push('Uses SoftDeleteHelper with deletedAt (may cause errors)');
      }
      
      // Check for role enum mismatches
      if (content.includes('"analist"')) {
        issues.push('Contains typo "analist" instead of "analyst"');
      }
      
      if (issues.length > 0) {
        console.log(`  ⚠ Issues found:`);
        issues.forEach(issue => console.log(`    - ${issue}`));
      }
    }
  } else {
    console.log(`✗ ${filePath} does not exist`);
  }
});

console.log('\nCheck completed. Please review the issues above.');