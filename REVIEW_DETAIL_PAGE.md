# Review DetailPage vs FormSubmissionPage

## Data yang diinput di FormSubmissionPage:

### Step 1: Basic Information
1. **Project Title** (`title`) - Required
2. **Department / Entity** (`department`) - Required
   - Options: Information Technology, Operations, Transport Authority
3. **Lead Innovator** (`lead`) - Optional, default: "Ahmed Ali"

### Step 2: Core Idea Description
4. **The Problem Statement** (`problem`) - Required
5. **The Proposed Solution** (`solution`) - Required
6. **Innovation Categories** (`categories`) - Optional, multiple select
   - Options: Artificial Intelligence, Efficiency, Sustainability

### Step 3: Supporting Materials
7. **Upload Documents** (`files`) - Optional
8. **Related Links** (`links`) - Optional

---

## Data yang ditampilkan di DetailPage:

### ✅ Data yang SELARAS (dari form input):
- Tidak ada yang selaras saat ini - semua data hardcoded

### ❌ Data yang TIDAK SELARAS (perlu diperbaiki):

1. **Project Title** (line 58)
   - DetailPage: "AI-Powered Citizen Service Portal" (hardcoded)
   - Seharusnya: dari form `title`

2. **Department** (line 314)
   - DetailPage: "Digital Dubai Authority" (hardcoded)
   - Seharusnya: dari form `department` (mapping: IT → "Information Technology", ops → "Operations", transport → "Transport Authority")

3. **Lead Innovator** (line 295)
   - DetailPage: "Ahmed Al Mansouri" (hardcoded)
   - Seharusnya: dari form `lead` (default: "Ahmed Ali")

4. **Innovation Categories** (line 132)
   - DetailPage: ["AI Lab", "Smart City", "Digital Inclusion"] (hardcoded)
   - Seharusnya: dari form `categories` (mapping: ai → "Artificial Intelligence", efficiency → "Efficiency", green → "Sustainability")

5. **Description/Overview** (line 162-179)
   - DetailPage: hardcoded paragraph panjang
   - Seharusnya: kombinasi dari `problem` dan `solution` dari form

6. **Attachments** (line 182-277)
   - DetailPage: hardcoded files (Technical_Spec_v2.pdf, Drone_Prototype.jpg)
   - Seharusnya: dari form `files` (uploaded documents)

7. **Related Links** (tidak ada di DetailPage)
   - FormSubmissionPage: ada field `links`
   - DetailPage: tidak ditampilkan
   - Seharusnya: ditambahkan section untuk menampilkan related links

### ✅ Data yang BENAR (AI-generated / System-generated - tidak perlu input manual):

1. **Status** (line 74) - "IN REVIEW"
   - System-generated berdasarkan status submission

2. **ID** (line 77) - "#INV-2024-089"
   - System-generated ID

3. **Submitted Date** (line 80) - "2 days ago"
   - System-generated dari timestamp submission

4. **AI Generated Summary** (line 320-363)
   - AI-generated dari analisis proposal
   - ✅ BENAR - tidak perlu input manual

5. **Score Breakdown** (line 365-446)
   - AI-generated scores (Innovation Level, Feasibility, Business Impact, etc.)
   - ✅ BENAR - tidak perlu input manual

6. **Similarity Analysis** (line 448-525)
   - AI-generated similarity dengan proyek lain
   - ✅ BENAR - tidak perlu input manual

7. **AI Recommendation** (line 534-608)
   - AI-generated recommendation (Strongly Endorse, 94% confidence)
   - ✅ BENAR - tidak perlu input manual

8. **Committee Action** (line 610-678)
   - Manual action oleh committee (Approve, Request Info, Reject)
   - ✅ BENAR - ini action manual, bukan dari form

9. **Activity History** (line 680-786)
   - System-generated timeline dari aktivitas
   - ✅ BENAR - system-generated, bukan dari form

---

## Kesimpulan:

### Data yang perlu diperbaiki untuk selaras dengan form:
1. ✅ Project Title → dari form `title`
2. ✅ Department → dari form `department` (dengan mapping)
3. ✅ Lead Innovator → dari form `lead`
4. ✅ Innovation Categories → dari form `categories` (dengan mapping)
5. ✅ Description/Overview → kombinasi `problem` + `solution`
6. ✅ Attachments → dari form `files`
7. ✅ Related Links → tambahkan section baru untuk menampilkan `links`

### Data yang sudah benar (AI/System-generated):
- Status, ID, Submitted Date
- AI Generated Summary
- Score Breakdown
- Similarity Analysis
- AI Recommendation
- Committee Action
- Activity History

---

## Rekomendasi:
DetailPage perlu diubah untuk menerima data dari form submission (baik melalui props, state management, atau API) dan menampilkan data yang diinput user, sambil tetap mempertahankan bagian AI-generated yang sudah ada.
