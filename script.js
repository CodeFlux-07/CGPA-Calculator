document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const setupSection = document.getElementById('setup-section');
    const calcSection = document.getElementById('calculator-section');
    const resultsSection = document.getElementById('results-section');
    
    const initialSubjectsInput = document.getElementById('initial-subjects');
    const btnGenerate = document.getElementById('btn-generate');
    const setupError = document.getElementById('setup-error');
    
    const subjectsContainer = document.getElementById('subjects-container');
    const btnAddSubject = document.getElementById('btn-add-subject');
    const btnCalculate = document.getElementById('btn-calculate');
    const btnReset = document.getElementById('btn-reset');
    
    const resCgpa = document.getElementById('res-cgpa');
    const resCredits = document.getElementById('res-credits');
    const resMessage = document.getElementById('res-message');
    
    const btnRecalculate = document.getElementById('btn-recalculate');
    const btnNewCalc = document.getElementById('btn-new-calc');
    const btnDownloadPdf = document.getElementById('btn-download-pdf');
    const departmentSelect = document.getElementById('department-select');
    
    let currentDepartment = 'BCA';

    const CURRICULUM = {
        "BCA": {
            "C++": 5,
            "Practical : C++": 4,
            "Discrete Mathematics": 4,
            "Oracle": 5,
            "Practical : Oracle": 3,
            "Operation Research": 3,
            "Practical : Operation Research": 2,
            "Java": 5,
            "Practical : Java": 3,
            "Numerical and Statistical Methods": 3,
            "Practical : Numerical and Statistical Methods": 2,
            "Python": 4,
            "Practical : Python": 3,
            "Data Structure and Algorithms": 3,
            "Practical : Data Structure and Algorithms": 2,
            "Software Engineering": 2,
            "Net Programming using C#": 5,
            "PHP Programming": 5,
            "Practical : Net Programming using C#": 5,
            "Practical : PHP Programming": 5,
            "Operating Systems and LINUX": 3,
            "Practical : LINUX": 3,
            "Internship ": 2
        },
        "B.Sc AI": {
            "C++": 5,
            "Practical : C++": 4,
            "Discrete Mathematics": 4,
            "HTML": 2,
            "Data Structure and Algorithms": 5,
            "Practical : Data Structure and Algorithms": 3,
            "Operation Research": 3,
            "Practical : Operation Research": 2,
            "Java": 5,
            "Practical : Java": 3,
            "Oracle": 3,
            "Practical : Oracle": 2,
            "Python": 4,
            "Practical : Python": 3,
            "Principle of AI": 3,
            "Practical : Principle of AI": 2,
            "Internet of Things": 2
        }
    };

    let subjectCount = 0;

    btnGenerate.addEventListener('click', generateInitialFields);
    initialSubjectsInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateInitialFields();
    });
    btnAddSubject.addEventListener('click', () => addSubjectRow());
    btnCalculate.addEventListener('click', calculateCGPA);
    btnReset.addEventListener('click', resetCalculator);
    btnRecalculate.addEventListener('click', showCalculator);
    btnNewCalc.addEventListener('click', newCalculation);
    btnDownloadPdf.addEventListener('click', downloadPDF);

    // Prevent scrolling from changing number inputs
    document.addEventListener('wheel', (e) => {
        if (document.activeElement.type === 'number') {
            document.activeElement.blur();
        }
    }, { passive: false });

    // Generator Logic
    function generateInitialFields() {
        const count = parseInt(initialSubjectsInput.value);
        
        if (isNaN(count) || count < 1 || count > 20) {
            setupError.textContent = 'Please enter a valid number between 1 and 20.';
            initialSubjectsInput.classList.add('error');
            return;
        }

        currentDepartment = departmentSelect.value;

        setupError.textContent = '';
        initialSubjectsInput.classList.remove('error');
        
        subjectsContainer.innerHTML = '';
        subjectCount = 0;
        
        for (let i = 0; i < count; i++) {
            addSubjectRow();
        }

        setupSection.classList.add('hidden');
        calcSection.classList.remove('hidden');
        calcSection.classList.add('fade-in');
        
        saveDataLocally('calc');
    }

    function addSubjectRow() {
        subjectCount++;
        const rowId = `subject-${Date.now()}-${subjectCount}`;
        
        const row = document.createElement('div');
        row.className = 'subject-row row align-items-center mb-3';
        row.id = rowId;
        
        const options = Object.keys(CURRICULUM[currentDepartment]).map(sub => `<option value="${sub}">${sub}</option>`).join('');

        row.innerHTML = `
            <div class="col-12 col-md-6 mb-1 mb-md-0">
                <div class="input-group mb-0">
                    <label>Subject</label>
                    <div class="input-with-icon">
                        <i class="fa-solid fa-book-open"></i>
                        <select class="subj-name" style="width: 100%; padding: 14px 16px 14px 45px; border-radius: var(--border-radius-md); border: 1px solid var(--input-border); background: var(--input-bg); color: var(--text-primary); font-size: 1rem; outline: none; transition: var(--transition); appearance: none;">
                            <option value="" disabled selected>Select Subject</option>
                            ${options}
                        </select>
                    </div>
                    <span class="error-text"></span>
                </div>
            </div>
            <div class="col-10 col-md-5">
                <div class="input-group mb-0">
                    <label>Mark</label>
                    <div class="input-with-icon">
                        <i class="fa-solid fa-star"></i>
                        <input type="number" class="subj-grade" min="0" max="100" step="1">
                    </div>
                    <span class="error-text"></span>
                </div>
            </div>
            <div class="d-none">
                <div class="input-group mb-0">
                    <label>Credits</label>
                    <div class="input-with-icon">
                        <i class="fa-solid fa-layer-group"></i>
                        <input type="number" class="subj-credit" readonly style="background: rgba(0,0,0,0.05); color: var(--text-secondary);">
                    </div>
                    <span class="error-text"></span>
                </div>
            </div>
            <div class="col-2 col-md-1 text-end d-flex justify-content-end align-items-end h-100" style="padding-top: 24px;">
                <button class="icon-btn btn-remove" aria-label="Remove Subject" style="margin-bottom: 24px;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        // Add Validation Listeners
        const nameSelect = row.querySelector('.subj-name');
        const creditInput = row.querySelector('.subj-credit');
        
        nameSelect.addEventListener('change', () => {
            creditInput.value = CURRICULUM[currentDepartment][nameSelect.value] || '';
            saveDataLocally('calc');
        });

        const gradeInput = row.querySelector('.subj-grade');
        gradeInput.addEventListener('input', () => {
            validateGrade(gradeInput);
            saveDataLocally('calc');
        });

        // Remove Listener
        const removeBtn = row.querySelector('.btn-remove');
        removeBtn.addEventListener('click', () => {
            if (document.querySelectorAll('.subject-row').length > 1) {
                row.remove();
                saveDataLocally('calc');
            } else {
                alert('You must have at least one subject!');
            }
        });

        subjectsContainer.appendChild(row);
    }

    // Validation
    function validateGrade(input) {
        const val = parseFloat(input.value);
        const errorSpan = input.closest('.input-group').querySelector('.error-text');
        
        if (input.value === '') {
            errorSpan.textContent = 'Required';
            input.classList.add('error');
            return false;
        } else if (isNaN(val) || val < 0 || val > 100) {
            errorSpan.textContent = 'Must be 0-100';
            input.classList.add('error');
            return false;
        } else {
            errorSpan.textContent = '';
            input.classList.remove('error');
            return true;
        }
    }

    function validateCredit(input) {
        const val = parseFloat(input.value);
        const errorSpan = input.closest('.input-group').querySelector('.error-text');
        
        if (input.value === '') {
            errorSpan.textContent = 'Required';
            input.classList.add('error');
            return false;
        } else if (isNaN(val) || val <= 0) {
            errorSpan.textContent = 'Must be > 0';
            input.classList.add('error');
            return false;
        } else {
            errorSpan.textContent = '';
            input.classList.remove('error');
            return true;
        }
    }

    // Calculation Logic
    function calculateCGPA() {
        const rows = document.querySelectorAll('.subject-row');
        let totalCreditPoints = 0;
        let totalCredits = 0;
        let isValid = true;

        rows.forEach(row => {
            const gradeInput = row.querySelector('.subj-grade');
            const creditInput = row.querySelector('.subj-credit');
            
            const isGradeValid = validateGrade(gradeInput);
            const isCreditValid = validateCredit(creditInput);
            
            if (!isGradeValid || !isCreditValid) {
                isValid = false;
            } else {
                const mark = parseFloat(gradeInput.value);
                const grade = mark / 10;
                const credit = parseFloat(creditInput.value);
                
                totalCredits += credit;
                totalCreditPoints += (grade * credit);
            }
        });

        if (!isValid) {
            return; // Stop calculation if there are validation errors
        }

        const cgpa = parseFloat((totalCreditPoints / totalCredits).toFixed(3));

        displayResults(cgpa, totalCredits);
        saveDataLocally('results');
    }

    function displayResults(cgpa, credits) {
        resCgpa.textContent = cgpa;
        resCredits.textContent = credits;

        // Performance Message Logic
        let msg = '';
        let bgColor = '';
        let textColor = '';

        const val = parseFloat(cgpa);
        if (val >= 9.0) {
            msg = 'Outstanding! 🌟 Keep up the brilliant work.';
            bgColor = 'var(--success-color)';
            textColor = 'var(--success-text)';
        } else if (val >= 8.0) {
            msg = 'Excellent! ✨ Great job.';
            bgColor = '#dbeafe'; // pastel blue
            textColor = '#1e40af';
        } else if (val >= 7.0) {
            msg = 'Very Good! 👍 Solid performance.';
            bgColor = '#fef3c7'; // pastel yellow
            textColor = '#92400e';
        } else if (val >= 6.0) {
            msg = 'Good! 📈 You can push higher.';
            bgColor = '#ffedd5'; // pastel orange
            textColor = '#9a3412';
        } else {
            msg = 'Needs Improvement. 💪 Don\'t give up!';
            bgColor = '#fee2e2'; // pastel red
            textColor = '#991b1b';
        }

        resMessage.innerHTML = msg;
        
        resMessage.style.backgroundColor = bgColor;
        resMessage.style.color = textColor;

        calcSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        resultsSection.classList.add('fade-in');

    }

    function showCalculator() {
        resultsSection.classList.add('hidden');
        calcSection.classList.remove('hidden');
        saveDataLocally('calc');
    }

    function newCalculation() {
        resultsSection.classList.add('hidden');
        setupSection.classList.remove('hidden');
        initialSubjectsInput.value = '';
        localStorage.removeItem('cgpaData');
    }

    function resetCalculator() {
        calcSection.classList.add('hidden');
        setupSection.classList.remove('hidden');
        initialSubjectsInput.value = '';
        localStorage.removeItem('cgpaData');
    }

    function saveDataLocally(state) {
        const rows = document.querySelectorAll('.subject-row');
        const subjects = [];
        
        rows.forEach(row => {
            subjects.push({
                name: row.querySelector('.subj-name').value,
                grade: row.querySelector('.subj-grade').value,
                credit: row.querySelector('.subj-credit').value
            });
        });

        let currentState = state;
        if (!currentState) {
            const existingData = JSON.parse(localStorage.getItem('cgpaData') || '{}');
            currentState = existingData.state || 'calc';
        }
        
        localStorage.setItem('cgpaData', JSON.stringify({
            subjects,
            cgpa: resCgpa.textContent,
            credits: resCredits.textContent,
            state: currentState,
            department: currentDepartment
        }));
    }

    // Load Data on Startup
    function loadSavedData() {
        const savedData = localStorage.getItem('cgpaData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                if (data.department) {
                    currentDepartment = data.department;
                    if (departmentSelect) departmentSelect.value = data.department;
                }
                if (data.subjects && data.subjects.length > 0) {
                    subjectsContainer.innerHTML = '';
                    subjectCount = 0;
                    
                    data.subjects.forEach(subj => {
                        addSubjectRow();
                        const rows = document.querySelectorAll('.subject-row');
                        const lastRow = rows[rows.length - 1];
                        
                        lastRow.querySelector('.subj-name').value = subj.name || '';
                        lastRow.querySelector('.subj-grade').value = subj.grade;
                        lastRow.querySelector('.subj-credit').value = subj.credit;
                    });
                    
                    setupSection.classList.add('hidden');
                    
                    if (data.state === 'results') {
                        displayResults(data.cgpa || '0.00', data.credits || '0');
                    } else {
                        calcSection.classList.remove('hidden');
                    }
                }
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }

    // PDF Download
    function downloadPDF() {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        let hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedDate = `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

        let txt = `----------------------------------------\n`;
        txt += `        🎓 CGPA CALCULATOR REPORT\n`;
        txt += `----------------------------------------\n\n`;
        txt += `Generated On: ${formattedDate}\n`;
        txt += `Department  : ${currentDepartment}\n\n`;
        txt += `SUBJECT DETAILS\n\n`;
        txt += `+--------------------------------+------+-------------+---------+\n`;
        txt += `| Subject                        | Mark | Grade Point | Credits |\n`;
        txt += `+--------------------------------+------+-------------+---------+\n`;
        const rows = document.querySelectorAll('.subject-row');
        let index = 1;
        rows.forEach(row => {
            const rawName = row.querySelector('.subj-name').value || `Sub ${index}`;
            const nameStr = rawName.substring(0, 30).padEnd(30, ' ');
            
            const mark = parseFloat(row.querySelector('.subj-grade').value);
            const grade = (mark / 10).toFixed(1);
            const credit = row.querySelector('.subj-credit').value;
            
            const markStr = String(mark).padEnd(4, ' ');
            const gradeStr = grade.padEnd(11, ' ');
            const credStr = credit.padEnd(7, ' ');
            
            txt += `| ${nameStr} | ${markStr} | ${gradeStr} | ${credStr} |\n`;
            index++;
        });

        txt += `+---------------------------------+------+-------------+---------+\n\n`;
        txt += `CGPA          : ${resCgpa.textContent}\n\n`;
        
        const cgpaVal = parseFloat(resCgpa.textContent);
        let perfTxt = '';
        if (cgpaVal >= 9.0) perfTxt = 'Outstanding 🌟';
        else if (cgpaVal >= 8.0) perfTxt = 'Excellent ⭐';
        else if (cgpaVal >= 7.0) perfTxt = 'Very Good 👍';
        else if (cgpaVal >= 6.0) perfTxt = 'Good 📈';
        else perfTxt = 'Needs Improvement 💪';

        txt += `Performance   : ${perfTxt}\n\n`;
        txt += `----------------------------------------\n`;
        txt += `Generated by CGPA Calculator\n`;
        txt += `----------------------------------------\n`;

        const element = document.createElement('div');
        element.style.width = '210mm';
        element.style.padding = '20mm';
        element.style.boxSizing = 'border-box';
        element.style.background = '#ffffff';
        element.style.color = '#000000';
        
        const pre = document.createElement('pre');
        pre.style.fontFamily = "'Courier New', Courier, monospace";
        pre.style.fontSize = '14px';
        pre.style.lineHeight = '1.5';
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.margin = '0';
        pre.style.fontWeight = '600';
        pre.textContent = txt;
        
        element.appendChild(pre);

        const opt = {
            margin:       0,
            filename:     'CGPA_Report.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            if (typeof html2pdf === 'undefined') {
                alert('PDF Library is blocked or failed to load. Please check your internet connection.');
                return;
            }
            html2pdf().set(opt).from(element).save().catch(err => {
                alert('PDF Error: ' + err.message);
            });
        } catch (e) {
            alert('An error occurred generating the PDF: ' + e.message);
        }
    }

    // Try load saved data
    loadSavedData();
});
