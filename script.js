const STORAGE_KEY = "smsStudentRecords";

const studentForm = document.getElementById("studentForm");
const studentNameInput = document.getElementById("studentName");
const rollNumberInput = document.getElementById("rollNumber");
const courseInput = document.getElementById("course");
const emailInput = document.getElementById("email");
const yearInput = document.getElementById("year");
const searchInput = document.getElementById("searchInput");
const studentTableBody = document.getElementById("studentTableBody");
const formMessage = document.getElementById("formMessage");

let students = loadStudents();

function loadStudents() {
  try {
    const savedStudents = localStorage.getItem(STORAGE_KEY);
    return savedStudents ? JSON.parse(savedStudents) : [];
  } catch (error) {
    return [];
  }
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = "form-message " + type;
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function createCell(className, text) {
  const cell = document.createElement("td");
  if (className) cell.className = className;
  cell.textContent = text;
  return cell;
}

function renderStudents() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm) ||
    student.rollNumber.toLowerCase().includes(searchTerm)
  );

  document.getElementById("totalStudents").textContent = students.length;
  document.getElementById("recordsAdded").textContent = students.length;
  document.getElementById("searchResults").textContent = filteredStudents.length;
  document.getElementById("recordCount").textContent =
    filteredStudents.length + (filteredStudents.length === 1 ? " record" : " records");

  studentTableBody.replaceChildren();

  if (filteredStudents.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 4;

    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    const icon = document.createElement("div");
    icon.className = "empty-icon";
    icon.textContent = "♙";
    const heading = document.createElement("strong");
    heading.textContent = searchTerm ? "No matching students" : "No students yet";
    const message = document.createElement("p");
    message.textContent = searchTerm
      ? "Try another name or roll number."
      : "Use the registration form to add your first student.";

    emptyState.append(icon, heading, message);
    cell.appendChild(emptyState);
    row.appendChild(cell);
    studentTableBody.appendChild(row);
    return;
  }

  filteredStudents.forEach((student) => {
    const row = document.createElement("tr");

    const studentCell = document.createElement("td");
    const studentInfo = document.createElement("div");
    studentInfo.className = "student-cell";
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = getInitials(student.name);

    const nameWrap = document.createElement("div");
    const name = document.createElement("div");
    name.className = "student-name";
    name.textContent = student.name;
    const emailSmall = document.createElement("div");
    emailSmall.className = "student-email-small";
    emailSmall.textContent = student.email;
    nameWrap.append(name, emailSmall);
    studentInfo.append(avatar, nameWrap);
    studentCell.appendChild(studentInfo);

    const rollCell = document.createElement("td");
    const rollBadge = document.createElement("span");
    rollBadge.className = "roll-badge";
    rollBadge.textContent = student.rollNumber;
    rollCell.appendChild(rollBadge);

    const courseCell = document.createElement("td");
    const courseWrap = document.createElement("div");
    const course = document.createElement("div");
    course.className = "course-name";
    course.textContent = student.course;
    const year = document.createElement("div");
    year.className = "year-name";
    year.textContent = student.year;
    courseWrap.append(course, year);
    courseCell.appendChild(courseWrap);

    const emailCell = createCell("email-cell", student.email);

    row.append(studentCell, rollCell, courseCell, emailCell);
    studentTableBody.appendChild(row);
  });
}

studentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = studentNameInput.value.trim();
  const rollNumber = rollNumberInput.value.trim();
  const course = courseInput.value;
  const email = emailInput.value.trim();
  const year = yearInput.value;

  if (!name || !rollNumber || !course || !email || !year) {
    showMessage("Please complete all required fields.", "error");
    return;
  }

  const duplicateRollNumber = students.some(
    (student) => student.rollNumber.toLowerCase() === rollNumber.toLowerCase()
  );

  if (duplicateRollNumber) {
    showMessage("That roll number already exists. Please enter a unique roll number.", "error");
    rollNumberInput.focus();
    return;
  }

  students.unshift({
    name,
    rollNumber,
    course,
    email,
    year
  });

  saveStudents();
  studentForm.reset();
  searchInput.value = "";
  showMessage("Student registered successfully!", "success");
  renderStudents();
  studentNameInput.focus();
});

studentForm.addEventListener("reset", function () {
  showMessage("", "");
});

searchInput.addEventListener("input", renderStudents);

renderStudents();
