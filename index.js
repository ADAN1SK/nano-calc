document.addEventListener('DOMContentLoaded', function () {
	const displayEl = document.getElementById('display');
	const keysContainer = document.querySelector('.keys');

	let currentExpression = '';

	function updateDisplay(value) {
		displayEl.textContent = String(value).slice(0, 32);
	}

	function clearAll() {
		currentExpression = '';
		updateDisplay('0');
	}

	function backspace() {
		currentExpression = currentExpression.slice(0, -1);
		updateDisplay(currentExpression || '0');
	}

	function appendNumber(num) {
		// Prevent multiple leading zeros
		if (num === '0' && currentExpression === '0') return;
		if (currentExpression === '0' && num !== '.') {
			currentExpression = num;
		} else {
			currentExpression += num;
		}
		updateDisplay(currentExpression);
	}

	

	function appendOperator(op) {
		if (!currentExpression) return;
		// Replace trailing operator with new one
		if (/[+\-*/]$/.test(currentExpression)) {
			currentExpression = currentExpression.slice(0, -1) + op;
		} else {
			currentExpression += op;
		}
		updateDisplay(currentExpression);
	}

	function evaluateExpression() {
		if (!currentExpression) return;
		// Sanitize: allow only digits, operators, dot and spaces
		if (!/^[0-9+\-*/. ()]+$/.test(currentExpression)) {
			updateDisplay('Error');
			currentExpression = '';
			return;
		}
		try {
			// Use Function to evaluate safely in local scope
			const result = Function('return ' + currentExpression)();
			if (result === Infinity || result === -Infinity || Number.isNaN(result)) {
				updateDisplay('Error (Invalid Result)');
				currentExpression = '';
				return;
			}
			currentExpression = String(result);
			updateDisplay(currentExpression);
		} catch (err) {
			updateDisplay('Error (Invalid Expression)');
			currentExpression = '';
		}
	}

	keysContainer.addEventListener('click ', function (e) {
		const target = e.target.closest('button');
		if (!target) return;

		const action = target.dataset.action;
		const number = target.dataset.num;
		const op = target.dataset.op;

		if (action === 'clear') {
			clearAll();
			return;
		}
		if (action === 'back') {
			backspace();
			return;
		}
		if (action === 'equals') {
			evaluateExpression();
			return;
		}
		if (number !== undefined) {
			appendNumber(number);
			return;
		}
		if (op !== undefined) {
			appendOperator(op);
			return;
		}
	});

	// Keyboard support
	window.addEventListener('keydown', function (e) {
		if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
			appendNumber(e.key);
			return;
		}
		if (['+', '-', '*', '/'].includes(e.key)) {
			appendOperator(e.key);
			return;
		}
		if (e.key === 'Enter' || e.key === '=') {
			evaluateExpression();
			return;
		}
		if (e.key === 'Backspace') {
			backspace();
			return;
		}
		if (e.key === 'Escape') {
			clearAll();
			return;
		}
	});

});
