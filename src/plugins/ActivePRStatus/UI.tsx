function ActivePRStatusUI(elem: Element): void {
  const { style } = elem;
  console.log('content script', elem);
  style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
}

export default ActivePRStatusUI;
