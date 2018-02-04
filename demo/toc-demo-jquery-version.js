const tocConf = {
	"title": "Table Of Contents",
	"placeholder": "[TOC]",
	"contentWrapper": ".post-content"
};



$("#btn-gen").click(function () {
	//Remove current TOC to generate a new one
	var existedTOC = $(".toc");
	if (existedTOC.length != 0) {
		existedTOC.before(
			'<p>' + tocConf.placeholder + '</p>'
		);
		existedTOC.remove();
	}

	var wrapper = $(tocConf.contentWrapper);
	if (wrapper.length == 1) {
		var firstElement = tocConf.contentWrapper + ">:first-child";

		//Check if the first element's text matches TOC placeholder
		if ($(firstElement).text() == tocConf.placeholder) {
			//Select all headings except those inside blockquotes
			var elements = wrapper.find(":header")
				.filter(":not(blockquote :header)");

			if (elements.length > 0) {
				//Remove the placeholder
				$(firstElement).remove();

				//Get the current TOC status class
				var statusClass =
				existedTOC.hasClass("toc-on") ?
				'toc-on' : 'toc-off';

				var TOC =
				'<div class="toc ' + statusClass + '">' +
					'<div class="toc-title">' +
						tocConf.title +
					'</div>' +
					'<ul class="toc-content">';

				var currHeading = elements[0].nodeName;
				var records = new Array();

				$.each(elements, function(key, content) {
					var text = content.innerText;

					//Escape double quotes
					var anc = text.replace(/"/g, '&quot;');

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

				TOC += '</ul></div>';
				$(firstElement).before(TOC);

				$(".toc-title").click(function () {
					var toc = $(".toc");
					toc.toggleClass("toc-off");
					toc.toggleClass("toc-on");
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
});

$("#btn-rst").click(function () {
	if (confirm('Are you sure to reset the contents?')) {
		$(tocConf.contentWrapper).html(
			'<p>' + tocConf.placeholder + '</p>'
		);

		//Reset heading status to have a entirely clear
		//See line xxx to line xxx
		delete headings;
		delete preHeading;
	}
});

$(".headings>button").click(function () {
	var hd = this.innerText;

	if (typeof(headings) == 'undefined')
		headings = new Array();
	if (typeof(preHeading) == 'undefined')
		preHeading = hd;

	switch (preHeading.localeCompare(hd)) {
		case 0:
			addElement(hd);
			break;

		case 1:
			if (!headings.includes(hd)) {
				alert(
					'This kind of heading ' +
					'structure is not supported.'
				);
				return;
			}

			preHeading = hd;
			while (headings.includes(preHeading)) {
				headings.pop();
			}
			addElement(hd);
			break;

		case -1:
			headings.push(preHeading);
			preHeading = hd;
			addElement(hd);
			break;
	}
});

function addElement(hd) {
	var ele = document.createElement(hd);
	var txt = document.createTextNode(
		Math.random().toString(36).substr(2, 7) + ' ' + hd
	);
	ele.appendChild(txt);

	var post = document.querySelector(".post-content");
	post.appendChild(ele);
}
