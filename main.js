const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const submitBtn = document.getElementById('submit-btn');

let imageSize = { width: 676, height: 380 }; // заданный размер изображения
const hostName = 'http://fs.brukkil.pp.ua:5000/';

function getImageSize() {
	fetch(hostName + 'size', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
	})
		.then(response => response.json())
		.then(data => imageSize = { width: data[0], height: data[1] })
		.catch(error => console.error(error));
}


function loadImage(event) {
	// Считываем выбранный файл
	const file = event.target.files[0];
	if (!file.type.match('image.*')) {
		alert('Выберите изображение!');
		return;
	}

	// Создаем объект для чтения файла
	const reader = new FileReader();

	// Событие, которое происходит после чтения файла
	reader.onload = function (event) {
		// Создаем новый объект Image
		const img = new Image();

		// Событие, которое происходит после загрузки изображения
		img.onload = function () {
			// Изменяем размер изображения
			const width = img.width;
			const height = img.height;
			let newWidth = imageSize.width;
			let newHeight = imageSize.height;
			if (width > height) {
				newHeight = Math.round(newWidth * height / width);
			} else {
				newWidth = Math.round(newHeight * width / height);
			}

			// Отображаем изображение на канвасе
			canvas.width = newWidth;
			canvas.height = newHeight;
			ctx.drawImage(img, 0, 0, newWidth, newHeight);

			// Кодируем изображение в формате base64
			const base64Image = canvas.toDataURL('image/jpeg', 1.0);
			console.log(base64Image)
			// Отправляем POST запрос на localhost:2001/image с телом запроса, содержащим изображение в формате base64
			fetch(hostName + 'model', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ image: base64Image })
			})
				.then(response => console.log(response))
				//.then(response => response.json())
				//.then(data => console.log(data))
				.catch(error => console.error(error));
		}

		// Устанавливаем источник изображения
		img.src = event.target.result;
	}

	// Читаем файл как URL-адрес
	reader.readAsDataURL(file);
}

// Обработчик события для загрузки изображения
document.getElementById('image').addEventListener('change', loadImage);

submitBtn.addEventListener('click', function (event) {
	event.preventDefault();
	alert('Пока что кнопка "Отправить" не делает ничего');
});


const lineWidth = 5;
const strokeColor = 'green';

function drawRect(coords) {
	xMin = coords[0]
	yMin = coords[1]
	xMax = coords[2]
	yMax = coords[3]
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = strokeColor;
	ctx.strokeRect(xMin, yMin, xMax - xMin, yMax - yMin);
}