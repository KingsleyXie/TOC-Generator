function loadJQuery() {
	var ele = document.createElement("script");
	ele.type = 'text/javascript';
	ele.src = 'https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js';
	document.getElementsByTagName("head")[0].appendChild(ele);
}
loadJQuery();



const config = {
	"title": "Table Of Contents",
	"placeholder": "[TOC]",
	"contentWrapper": ".post-content"
};



//Wait some time to load JQuery file = =
setTimeout(function() {
	bindClickEvents();
}, 300);

function bindClickEvents() {
	$("#btn-gen").click(function () {
		//
	});

	$("#btn-rst").click(function () {
		if (confirm('Are you sure to reset the contents?')) {
			$(config.contentWrapper).html(
				'<p>' + config.placeholder + '</p>'
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
}

function addElement(hd) {
	var ele = document.createElement(hd);
	var txt = document.createTextNode(
		Math.random().toString(36).substr(2, 7) + ' ' + hd
	);
	ele.appendChild(txt);

	var post = document.querySelector(".post-content");
	post.appendChild(ele);
}
