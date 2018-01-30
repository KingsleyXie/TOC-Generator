$("<link/>", {
	rel: "stylesheet",
	href: "./assets/toc.css"
}).appendTo("head");



const config = {
	"title": "Table Of Contents",
	"contentWrapper": ".post-content"
};

var wrapper = $(config.contentWrapper);
if ((wrapper.length == 1) &&
	($(config.contentWrapper + ">:first-child").text() == '[TOC]')) {
	$(config.contentWrapper + ">:first-child").remove();

	var elements = wrapper.find(":header")
		.filter(":not(blockquote :header)");

	if (elements.length > 0) {
		var TOC =
		'<div class="toc toc-off">' +
			'<div class="toc-title">' +
				config.title +
			'</div>' +
			'<ul class="toc-content">';

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
		$(config.contentWrapper + ">:first-child").before(TOC);

		$(".toc-title").click(function () {
			var toc = $(".toc");
			toc.toggleClass("toc-off");
			toc.toggleClass("toc-on");
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
