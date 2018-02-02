const config = {
	"title": "Table Of Contents",
	"contentWrapper": ".post-content"
};



var cssLink = document.createElement("link");
cssLink.rel = "stylesheet";
cssLink.href = "../assets/toc.css"
document.getElementsByTagName("head")[0].appendChild(cssLink);



document.querySelectorAll(".btn-heading>button")
.forEach(function(btn) {
	btn.addEventListener('click', function () {
		addHeading(this.innerText);
	});
});

function addHeading(val) {
	if (typeof(headings) == 'undefined')
		headings = new Array();
	if (typeof(preHeading) == 'undefined')
		preHeading = val;

	switch (preHeading.localeCompare(val)) {
		case 0:
			addElement(val);
			break;

		case 1:
			if (!headings.includes(val)) {
				alert('This kind of heading structure is not supported.');
				return;
			}

			preHeading = val;
			while (headings.includes(preHeading)) {
				headings.pop();
			}
			addElement(val);
			break;

		case -1:
			headings.push(preHeading);
			preHeading = val;
			addElement(val);
			break;
	}
}

function addElement(val) {
	var ele = document.createElement(val);
	var txt = document.createTextNode(
		Math.random().toString(36).substr(2, 11) + ' ' + val
	);
	ele.appendChild(txt);

	var post = document.querySelector(".post-content");
	post.appendChild(ele);
}

function generateTOC() {
	var existedTOC = document.querySelector(".toc");
	if (existedTOC != null) {
		existedTOC.insertAdjacentHTML('beforebegin', '<p>[TOC]</p>');
		existedTOC.parentNode.removeChild(existedTOC);
	}

	var wrapper = document.querySelectorAll(config.contentWrapper);
	if ((wrapper.length == 1) &&
		(wrapper[0].firstElementChild.innerText == '[TOC]')) {
		wrapper[0].removeChild(wrapper[0].firstElementChild);

		var elements = Array.prototype.filter.call(
			wrapper[0].querySelectorAll("h1,h2,h3,h4,h5,h6"),
			function(ele) {
				var result = true;

				document.querySelectorAll("blockquote")
				.forEach(function(bq) {
					bq.querySelectorAll("h1,h2,h3,h4,h5,h6")
					.forEach(function(v) {
						if (ele == v) result = false;
					});
				});

				return result;
			}
		);

		if (elements.length > 0) {
			var TOC =
			'<div class="toc ' +
			(
				existedTOC == null ? 'toc-off' :
				(
					existedTOC.classList.contains("toc-on") ?
					'toc-on' : 'toc-off'
				)
			) +
			'">' +
				'<div class="toc-title">' +
					config.title +
				'</div>' +
				'<ul class="toc-content">';

			var currHeading = elements[0].nodeName;
			var records = new Array();

			elements.forEach(function(content) {
				var text = content.innerText;
				var link = '<a href="#' + text + '">' + text  + '</a>';
				content.id = text;

				switch (currHeading.localeCompare(content.nodeName)) {
					case 0:
						TOC += '</li><li>' + link;
						break;

					case 1:
						currHeading = content.nodeName;

						if (!records.includes(currHeading)) {
							console.warn(
								'There may be some problem ' +
								'with your heading structure, ' +
								'so the generated TOC is not guaranteed ' +
								'to be in right order.'
							);
						}

						while (records.includes(currHeading)) {
							TOC += '</li></ul>';
							records.pop();
						}
						TOC += '<li>' + link;
						break;

					case -1:
						TOC += '<ul><li>' + link;
						records.push(currHeading);
						currHeading = content.nodeName;
						break;
				}
			});

			TOC += '</ul></div>';
			document.querySelector(config.contentWrapper).children[0]
			.insertAdjacentHTML('beforebegin', TOC);

			document.querySelector(".toc-title")
			.addEventListener('click', function () {
				var toc = document.querySelector(".toc");
				toc.classList.toggle("toc-off");
				toc.classList.toggle("toc-on");
			});
		} else {
			console.warn('No heading found to generate TOC.');
		}
	} else {
		if (wrapper.length != 1) {
			console.warn(
				'The provided Selector `' +
				config.contentWrapper + '` ' +
				(
					wrapper.length == 0 ?
					'is not valid.' : 'matches multiple elements'
				)
			);
		}
	}
}

function resetContents() {
	document.querySelector(config.contentWrapper)
	.innerHTML = '<p>[TOC]</p>';
}
