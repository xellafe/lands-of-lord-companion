const url = window.location.href;
const divider = document.createElement('hr');
divider.classList.add('divider');
if (url.includes('/unit:') && url.includes(':skills')) {
    const skillTab = document.getElementsByClassName('block')[1].firstChild;
    const affinity = document.createElement('table');
    const tbody = affinity.appendChild(document.createElement('tbody'));
    for (let i = 0; i < 5; i++) {
        const row = tbody.insertRow();
        for (let j = 0; j < 2; j++) {
            const cell = row.insertCell();
            if (j === 0) {
                cell.classList.add('name');
                cell.textContent = 'Prova';
            } else {
                cell.classList.add('bonus', 'green');
                cell.textContent = '75%';
            }
        }
    }
    skillTab.insertBefore(divider, skillTab.firstChild);
    skillTab.insertBefore(affinity, skillTab.firstChild);
}
