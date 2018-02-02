function loadJQuery() {
	var ele = document.createElement("script");
	ele.type = 'text/javascript';
	ele.src = 'https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js';
	document.getElementsByTagName("head")[0].appendChild(ele);
}



loadJQuery();
function addHeading() {
	var val = document.getElementById("selection").value;

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

	var post = document.getElementById("post-content");
	post.appendChild(ele);
}

function generateTOC() {
	$(".toc").remove();

	var config = {
		"title": "Table Of Contents",
		"contentWrapper": ".post-content"
	};

	var elements =
		$(config.contentWrapper).find(":header")
		.filter(":not(blockquote :header)");

	if (elements.length > 0) {
		var TOC = '<div class="toc">' + config.title + '<ul>';

		var currHeading = elements[0].nodeName;
		var records = new Array();

		$.each(elements, function(key, content) {
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
							'Warning: There may be some problem with your heading structure, ' +
							'so the generated TOC is not guaranteed to be in right order.'
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
		$(config.contentWrapper).find(">:first-child").before(TOC);
	} else {
		console.warn('No heading found to generate TOC.');
	}
}
