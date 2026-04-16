const header = document.createElement('h1');
header.textContent = "Today";

export function todayView() {
    const todayContent = document.createElement('div');

    todayContent.append(header)
    return todayContent;
}