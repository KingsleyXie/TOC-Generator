const tocConf = {
	"title": "Table Of Contents",
	"placeholder": "[TOC]",
	"contentWrapper": ".post-content"
};

var wrapper = document.querySelectorAll(tocConf.contentWrapper);
if (wrapper.length == 1) {
	var firstElement = wrapper[0].firstElementChild;

	//Check if the first element's text matches TOC placeholder
	if (firstElement.innerText == tocConf.placeholder) {
		//Select all headings except those inside blockquotes
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
			//Remove the placeholder
			wrapper[0].removeChild(firstElement);

			// Add Some Temporary Fix For The Generator Problem
			// TODO: I Shall Refactory It Later
			// 20190121
			var text = elements[0].innerText;
			var link = '<a href="#' + text.replace(/"/g, '&quot;') + '">' + text  + '</a>';

			var TOC =
			'<div class="toc toc-off">' +
				'<div class="toc-title">' +
					tocConf.title +
				'</div>' +
				'<ul class="toc-content">' +
				'<li>' + link;

			var currHeading = elements[0].nodeName;
			var records = new Array();
			elements.shift();

			elements.forEach(function(content) {
				text = content.innerText;

				//Escape double quotes
				anc = text.replace(/"/g, '&quot;');

				//Generate the link code and set the anchor
				var link = '<a href="#' + anc + '">' + text  + '</a>';
				content.id = text;

				switch (currHeading.localeCompare(content.nodeName)) {
					//Same level heading
					case 0:
						TOC += '</li><li>' + link;
						break;

					//Upper level heading
					case 1:
						currHeading = content.nodeName;

						if (!records.includes(currHeading)) {
							console.warn(
								'There may be some problem ' +
								'with the structure of your headings, ' +
								'so the generated TOC is not ' +
								'guaranteed to be in right order.'
							);
						}

						//Cancel the indentation until heading level meets
						while (records.includes(currHeading)) {
							TOC += '</li></ul>';
							records.pop();
							if (records.length == 0) TOC += '</li>';
						}
						TOC += '<li>' + link;
						break;

					//Lower level heading
					case -1:
						//Indent for once
						TOC += '<ul><li>' + link;
						records.push(currHeading);
						currHeading = content.nodeName;
						break;
				}
			});

			//Cancel all the indentation
			while (records.length != 0) {
				TOC += '</li></ul>';
				records.pop();
			}
			TOC += '</li></ul></div>';

			document.querySelector(tocConf.contentWrapper).children[0]
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
	}
} else {
	//Exception handler(warning in console)
	console.warn(
		'The provided Selector `' +
		tocConf.contentWrapper + '` matches' +
		(
			wrapper.length == 0 ?
			'no element.' : 'multiple elements.'
		)
	);
}
