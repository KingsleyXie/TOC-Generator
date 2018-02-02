const config = {
	"title": "Table Of Contents",
	"placeholder": "[TOC]",
	"contentWrapper": ".post-content"
};

var wrapper = $(config.contentWrapper);

if (wrapper.length == 1) {
	var firstElement = config.contentWrapper + ">:first-child";

	//Check if the first element's text matches TOC placeholder
	if ($(firstElement).text() == config.placeholder) {
		//Select all headings except those inside blockquotes
		var elements = wrapper.find(":header")
			.filter(":not(blockquote :header)");

		if (elements.length > 0) {
			//Remove the placeholder
			$(firstElement).remove();

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
				//Generate the link code
				var link = '<a href="#' + text + '">' + text  + '</a>';
				//Set an anchor for current heading
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
		config.contentWrapper + '` matches' +
		(
			wrapper.length == 0 ?
			'no element.' : 'multiple elements.'
		)
	);
}
