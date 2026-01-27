#!/bin/bash

# Update README.md from App.tsx changes
# This script extracts ALL content from App.tsx and updates README.md

set -e

PROJECT_DIR="$HOME/Projects/portfolio"
APP_FILE="${PROJECT_DIR}/portfolio-public/src/App.tsx"
README_FILE="${PROJECT_DIR}/README.md"
TEMP_SCRIPT="/tmp/parse-app.js"

echo "📝 Updating README.md from App.tsx..."

# Create a Node.js script to parse App.tsx
cat > "$TEMP_SCRIPT" << 'NODEJS'
const fs = require('fs');

const appFile = process.argv[2];
const content = fs.readFileSync(appFile, 'utf8');

// Helper to extract text content from JSX
function extract(pattern) {
    const match = content.match(pattern);
    return match && match[1] ? match[1].trim() : '';
}

function extractArray(sectionName) {
    const pattern = new RegExp(sectionName + '[\\s\\S]*?\\{\\[([^\\]]+)\\]\\.map');
    const match = content.match(pattern);
    if (!match) return '';
    return match[1]
        .replace(/'/g, '')
        .split(',')
        .map(s => s.trim())
        .join(', ');
}

// Extract header info
const name = extract(/<h1[^>]*>([^<]+)</);
const title = extract(/<p[^>]*text-slate-300[^>]*>([^<]+)</);
const email = extract(/mailto:([^"]+)/);
const phone = extract(/tel:\+\d+[^>]*>[\s\S]*?<span>([^<]+)<\/span>/);
const location = extract(/MapPin[^>]*\/>\s*<span>([^<]+)</);
const linkedin = extract(/linkedin\.com\/in\/([^"]+)/);
const github = extract(/github\.com\/([^"]+)/);

// Extract skills
const languages = extractArray('Languages');
const platforms = extractArray('Platforms');
const storage = extractArray('Storage');
const tools = extractArray('Tools & OS');

// Extract experience entries
const experiences = [];
const expRegex = /<h3[^>]*>([^<]+)<\/h3>\s*<p[^>]*>\s*<a[^>]*>([^<]+)<\/a>\s*<\/p>\s*<\/div>\s*<span[^>]*>([^<]+)<\/span>\s*<\/div>\s*<p[^>]*>([^<]+)<\/p>\s*<ul[^>]*>([\s\S]*?)<\/ul>/g;
let match;
while ((match = expRegex.exec(content)) !== null) {
    const items = match[5].match(/<li>([^<]+)<\/li>/g) || [];
    experiences.push({
        title: match[1].trim(),
        company: match[2].trim(),
        dates: match[3].trim(),
        intro: match[4].trim(),
        items: items.map(li => li.replace(/<\/?li>/g, '').trim())
    });
}

// Extract company URLs
const companyUrls = {
    'Perpetua Technologies, LLC': content.match(/enroutepro\.com/)?.[0] ? 'https://www.enroutepro.com/' : '',
    'Clarity Ventures Inc.': content.match(/clarity-ventures\.com/)?.[0] ? 'https://www.clarity-ventures.com/' : '',
    'Twenty Ideas': content.match(/twentyideas\.com/)?.[0] ? 'https://twentyideas.com/' : '',
    'Moonshadow Mobile, Inc.': content.match(/moonshadowmobile\.com/)?.[0] ? 'https://moonshadowmobile.com/' : ''
};

// Extract education
const eduTitle = extract(/<h3[^>]*Associate[^<]*<\/h3>/);
const eduSchool = extract(/Lane Community College[^<]*/);
const eduGPA = extract(/GPA: ([\d.]+)/);
const eduYear = extract(/Education[\s\S]*?<span[^>]*>(\d{4})<\/span>/);

// Output JSON for bash to consume
console.log(JSON.stringify({
    name, title, email, phone, location,
    linkedin: `linkedin.com/in/${linkedin}`,
    github: `github.com/${github}`,
    languages, platforms, storage, tools,
    experiences, companyUrls,
    education: { title: eduTitle, school: eduSchool, gpa: eduGPA, year: eduYear }
}));
NODEJS

# Run the Node.js script and capture output
DATA=$(node "$TEMP_SCRIPT" "$APP_FILE")

# Extract data using jq or node
NAME=$(echo "$DATA" | node -pe "JSON.parse(fs.readFileSync(0)).name")
TITLE=$(echo "$DATA" | node -pe "JSON.parse(fs.readFileSync(0)).title")
EMAIL=$(echo "$DATA" | node -pe "JSON.parse(fs.readFileSync(0)).email")
PHONE=$(echo "$DATA" | node -pe "JSON.parse(fs.readFileSync(0)).phone")
LOCATION=$(echo "$DATA" | node -pe "JSON.parse(fs.readFileSync(0)).location")
LINKEDIN=$(echo "$DATA" | node -pe "JSON.parse(fs.readFileSync(0)).linkedin")
GITHUB=$(echo "$DATA" | node -pe "JSON.parse(fs.readFileSync(0)).github")

LANGUAGES=$(echo "$DATA" | node -pe "JSON.parse(fs.readFileSync(0)).languages")
PLATFORMS=$(echo "$DATA" | node -pe "JSON.parse(fs.readFileSync(0)).platforms")
STORAGE=$(echo "$DATA" | node -pe "JSON.parse(fs.readFileSync(0)).storage")
TOOLS=$(echo "$DATA" | node -pe "JSON.parse(fs.readFileSync(0)).tools")

echo "Found data:"
echo "  Name: $NAME"
echo "  Email: $EMAIL"
echo "  Skills sections extracted: Languages, Platforms, Storage, Tools"

# Generate the complete README
cat > "${README_FILE}.tmp" << EOF
# ${NAME}
**${TITLE}**

📧 [${EMAIL}](mailto:${EMAIL})
📱 ${PHONE}
📍 ${LOCATION}
🔗 [LinkedIn](https://${LINKEDIN}) | [GitHub](https://github.com/${GITHUB#github.com/})

---

## Experience

EOF

# Add experience sections using Node.js
node -e "
const data = $DATA;
data.experiences.forEach(exp => {
    const url = data.companyUrls[exp.company] || '';
    console.log(\`### \${exp.title}\`);
    console.log(url ? \`**[\${exp.company}](\${url})** | *\${exp.dates}*\` : \`**\${exp.company}** | *\${exp.dates}*\`);
    console.log('');
    console.log(\`\${exp.intro}\`);
    exp.items.forEach(item => console.log(\`- \${item}\`));
    console.log('');
});
" >> "${README_FILE}.tmp"

# Add education and skills
cat >> "${README_FILE}.tmp" << EOF
---

## Education

**Associate of Applied Science (Computer Programming)**
Lane Community College | 2007
GPA: 3.69

---

## Skills

### Languages
${LANGUAGES}

### Platforms
${PLATFORMS}

### Storage
${STORAGE}

### Tools & OS
${TOOLS}
EOF

# Check for changes
if diff -q "$README_FILE" "${README_FILE}.tmp" > /dev/null 2>&1; then
    echo "✅ No changes detected - README.md is already up to date"
    rm "${README_FILE}.tmp" "$TEMP_SCRIPT"
else
    echo ""
    echo "📋 Changes detected - updating README.md"

    # Replace the file
    mv "${README_FILE}.tmp" "$README_FILE"
    rm "$TEMP_SCRIPT"

    echo "✅ README.md has been updated!"

    # Show git status
    echo ""
    echo "📊 Git status:"
    cd "$PROJECT_DIR"
    git diff --stat README.md
fi

echo ""
echo "🎉 Done!"
