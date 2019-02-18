var World = {

	bookId:"",
	bookToFind:"",

	init: function initFn() {
		this.createOverlays();
	},

	createCollectionDrawable: function createCollectionDrawableFn(lighthouse) {
		
		var collcont,arrow,directions,distance,dirdisplay,bookdisplay,bookcont,header,colldisplay;

		var collection = metadata.books.filter(function (entry) {return entry.physicalLocation.lighthouseTarget === lighthouse});
		var booktobefound = metadata.books.filter(function (entry) {return entry.id ===World.bookToFind});

		//If user has arrived at the location where the book is, show shelf location reminder
		if (World.bookToFind!="" && booktobefound[0].physicalLocation.lighthouseTarget === lighthouse){
			collcont=collection[0].physicalLocation.shortDesc;
			header="The "+collection[0].physicalLocation.name;
			colldisplay ='display:flex;'; 
			dirdisplay='display:none;';
			bookdisplay='display:flex;';
			bookcont = '<div>The book you are looking for book is located at<br><b>'+booktobefound[0].callCode+'</b></div></div><img style="height:100%" src="'+booktobefound[0].coverImg+'"></div>';
			directions = '';
			distance = '';
			arrow='';
		
		}
		//User is looking for book, but is not on location, show directions to location
		else if (World.bookToFind!="" && booktobefound[0].physicalLocation.lighthouseTarget != lighthouse){

			for (var i=0; i<metadata.directions.length; i++){
				if (collection[0].physicalLocation.name==metadata.directions[i].from){
					if (booktobefound[0].physicalLocation.name==metadata.directions[i].to) {
						directions = metadata.directions[i].directions;
						distance = metadata.directions[i].distance;
						arrow = metadata.directions[i].arrow;		
					}
				}
			}

			collcont=collection[0].physicalLocation.shortDesc;
			header="Go to the "+booktobefound[0].physicalLocation.name;
			colldisplay ='display:none;';
			dirdisplay='display:flex;';
			bookdisplay='display:none;';
			bookcont = '';

		}
		//If user is not looking for a book, simply show info about collection
		else  {
			collcont=collection[0].physicalLocation.shortDesc;
			header="The "+collection[0].physicalLocation.name;
			colldisplay ='display:flex;';
			dirdisplay='display:none;';
			bookdisplay='display:none;';
			bookcont = '';
			directions = '';
			distance = '';
			arrow='';
		}

		return new AR.HtmlDrawable({
			html:'<div style="color:#78E4FF; box-sizing: border-box; opacity:0.9; height:1024; width:1024px; font-family:Arial, Helvetica, sans-serif"><div style="width:100%; font-weight:bold; font-size:70px; padding:20px; text-shadow: 5px 5px 10px #007082, -5px 5px 10px #007082, 5px -5px 10px #007082, -5px -5px 10px #007082; ">'+header+'</div><div style="'+colldisplay+' background-color:rgba(66,66,66,0.9); text-shadow: 20px 20px 0px #007082, text-shadow: -20px -20px 0px #007082; font-size:56px; padding:20px; border: 14px #78E4FF solid; width:100%; box-sizing: border-box;">'+collcont+'</div><div style="'+dirdisplay+' align-items:center; justify-content:space-between; color:#ffffff; font-size:45px; margin-top:50px; width:100%; box-sizing: border-box;"><div style="display:flex; align-items:center; text-align:center; height:240px; width:45%; padding:50px; background-color:rgba(66,66,66,0.9); border-radius: 10%; border: 14px #ffffff solid;">'+directions+'</div><div style="display:flex; box-sizing: border-box; align-items:center; justify-content:center; height:220px; width:40%; background-image: url('+arrow+'); background-repeat:no-repeat; background-size:contain; background-position:right; font-size:60px; text-shadow: 2px 2px 3px #333333, -2px 2px 3px #333333, 2px -2px 3px #333333, -2px -2px 3px #333333; filter: drop-shadow(0px 20px 15px #ffffff) drop-shadow(-10px 0px 15px #ffffff) drop-shadow(0px -20px 15px #ffffff)">'+distance+'</div></div><div style="'+bookdisplay+' justify-content:space-between; align-items:center; color:#ffffff; font-size:55px; margin-top:40px; width:100%; height:380px; width:100%; box-sizing: border-box; padding:20px; background-color:rgba(66,66,66,0.9); border-radius: 15px; border: 14px #ffffff solid;"><div style="text-align:center">'+bookcont+'</div>' 
			}, 1, {
			viewportWidth: 1024,
			viewportHeight:1024,
			translate: {
				x: -0.50,
				y: 0.64 
			},
			horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.LEFT,
			verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP,

			onError: World.onError
		});
	},
	
	createOverlays: function createOverlaysFn() {


		var collectionDescriptions = {};
		var shortDescriptions = {};
		var videoButtons = {};
		var wikiButtons = {};
		var relatedButtons = {};
		var morefromButtons = {};
		var book;

		this.targetCollectionResource = new AR.TargetCollectionResource("assets/tracker.wtc", {
			onError: World.onError
		});

		this.tracker = new AR.ImageTracker(this.targetCollectionResource, {
			onTargetsLoaded: World.hideLoadingMessage,
			onError: World.onError
		});


		//Loop through metadata
		for (let i=0; i<metadata.books.length; i++){
	
			//Video-button where video exists
			if (metadata.books[i].videoUrl!=""){
			
				videoButtons[metadata.books[i].id] = new AR.HtmlDrawable({
					html:'<img style="width:100%" src="'+metadata.books[i].videoButton+'">'
				}, 0.6, {
					viewportWidth: 1024,
					viewportHeight: 512,

					translate: {
						x: -0.31,
						y: -0.18
					},

					horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.LEFT,
					verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP,

					onClick : () => {
						console.log(metadata.books[i].videoSource,metadata.books[i].videoUrl);
						if (metadata.books[i].videoSource=="file") {
							AR.context.startVideoPlayer(metadata.books[i].videoUrl);
							console.log("file");
						}
						
						else{
							AR.context.openInBrowser(metadata.books[i].videoUrl);
							console.log("youtube");
						}
					},
					onError: World.onError
				});
			}
		
			//Description-box
			shortDescriptions[metadata.books[i].id] = new AR.HtmlDrawable({
				html:'<div style="width:1024px; color:white; font-family:Arial, Helvetica, sans-serif; border: 4px #444444 solid; background-color:black; opacity:0.9; position:relative; font-size:50px; padding:25px"><b>'+metadata.books[i].title+'</b><br><br>'+metadata.books[i].shortDesc+'</div>'
			}, 0.6, {
				viewportWidth: 1024,
				viewportHeight: 610,
				translate: {
					x: -0.31,
					y: 0.14
				},
				horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.LEFT,
				verticalAnchor: AR.CONST.VERTICAL_ANCHOR.BOTTOM,

				onError: World.onError
			});
		
			//Wikipedia-link, if exists
			if (metadata.books[i].wikipediaUrl!="") {

				wikiButtons[metadata.books[i].id] = new AR.HtmlDrawable({
					html:'<div style="width:1024px; display: table-cell; color:white; font-family:Arial, Helvetica, sans-serif; border-radius: 5%; background-color:#4348C6; position:relative; font-size:80px; vertical-align: middle; text-align: center;">Read more at Wikipedia</div>'
				}, 0.6, {
					viewportWidth: 1024,
					viewportHeight: 100,
					translate: {
						x: -0.31,
						y: 0.02
					},

					horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.LEFT,
					verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP,

					onClick : () => {
						AR.context.openInBrowser(metadata.books[i].wikipediaUrl);
					},

					onError: World.onError
				});
			}
			
			//Related books
			relatedButtons[metadata.books[i].id] = new AR.HtmlDrawable({
				html:'<div style="width:200px; margin:5px; display: table-cell; color:white; font-family:Arial, Helvetica, sans-serif; border-radius: 10%; background-color:#FFCC00; position:absolute; font-size:33px; vertical-align: middle; text-align: center; padding:10px;">Similar<br>books</div>'
			}, 0.3, {
				viewportWidth: 200,
				viewportHeight: 80,
				translate: {
					x: -0.31,
					y: -0.05
				},

				horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.LEFT,
				verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP,

				onClick : () => {
					World.otherBooks('related');
				},

				onError: World.onError
			});
			
			//More books by author (if any)
			var authorCount=0;
			for (let ii=0; ii<metadata.books.length; ii++){
				if (metadata.books[i].creator===metadata.books[ii].creator) authorCount++;
			}

			if (authorCount>1) {

				morefromButtons[metadata.books[i].id] = new AR.HtmlDrawable({
					html:'<div style="width:200px; margin-bottom:5px; margin-top:5px; margin-left:40px; display: table-cell; color:white; font-family:Arial, Helvetica, sans-serif; border-radius: 10%; background-color:#2ECC40; position:absolute; font-size:33px; vertical-align: middle; text-align: center; padding:10px;">More from<br>author</div>'
				}, 0.3, {
				
					viewportWidth: 200,
					viewportHeight: 80,

					translate: {
						x: -0.011,
						y: -0.05
					},

					horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.LEFT,
					verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP,

					onClick : () => {
						World.otherBooks('more');
					},
					onError: World.onError
				});

			}
		}

		this.bookCover = new AR.ImageTrackable(this.tracker, "*", {
			
			onImageLost: function(target) {
				
				this.removeImageTargetCamDrawables(target);
			},
			onImageRecognized: function(target) {
				
				//Scans a lighthouse
				if (target.name.slice(0, -1)=="lighthouse") {

					this.addImageTargetCamDrawables(target, World.createCollectionDrawable(target.name));
				}

				//Scans a book
				else {
					//User has selected a related book to be located on lighthouse, don't interact with books
					if (World.bookToFind==="") {

						World.bookId = target.name.slice(0, -1);
					
						book = metadata.books.filter(function (entry) {return entry.id === World.bookId});
					
						if (book[0].videoUrl!="") this.addImageTargetCamDrawables(target, videoButtons[World.bookId]);
						if (book[0].shortDesc!="") this.addImageTargetCamDrawables(target, shortDescriptions[World.bookId]);
						if (book[0].wikipediaUrl!="") this.addImageTargetCamDrawables(target, wikiButtons[World.bookId]);

						this.addImageTargetCamDrawables(target, relatedButtons[World.bookId]);
						if (typeof morefromButtons[World.bookId]!="undefined") this.addImageTargetCamDrawables(target, morefromButtons[World.bookId]);
					}
				}
				
			},
			onError: World.onError
		});
	},

	onError: function onErrorFn(error) {
		alert(error);
	},

	onAlert: function onAlertFn(msg){
		alert(msg);
	},

	hideLoadingMessage: function hideLoadingMessageFn() {
		document.getElementById("loadingMessage").style.display = "none";
		document.getElementById("infoBox").style.display = "block";
	},

	otherBooks: function otherBooksFn(type){
		
		$("#otherBooks").show();
		$("#infoBox").hide();
		$(".subcontent").empty();

		var imgs = [];
		var wayfinderimg;

		var origBook = metadata.books.filter(function (entry) {return entry.id === World.bookId});
		
		if (type=="related") {

			$("#otherBooks").find(".subheader").html("<h1>Similar books</h1>Click on a book to get information");

			for (var i=0; i<origBook[0].subjectHeadings.length; i++) {
				
				for (var ii=0; ii<metadata.books.length; ii++) {

					if ($.inArray(origBook[0].subjectHeadings[i],metadata.books[ii].subjectHeadings)>-1 && metadata.books[ii].id!=World.bookId && $.inArray(metadata.books[ii].coverImg,imgs)==-1) {

						imgs.push(metadata.books[ii].coverImg);

						$("#otherBooks").find(".subcontent").append('<div id="'+metadata.books[ii].id+'" class="newbook"><img src="'+metadata.books[ii].coverImg+'">Available at<br>'+metadata.books[ii].physicalLocation.name+' '+metadata.books[ii].callCode)+'</div>';
					}
				}
			}
		}

		else if (type=="more") {

			$("#otherBooks").find(".subheader").html("<h1>More from author</h1>Click on a book to get information");
			for (var ii=0; ii<metadata.books.length; ii++){

				if (origBook[0].creator===metadata.books[ii].creator && metadata.books[ii].id!=World.bookId){

					$("#otherBooks").find(".subcontent").append('<div id="'+metadata.books[ii].id+'" class="newbook"><img src="'+metadata.books[ii].coverImg+'">Available at<br>'+metadata.books[ii].physicalLocation.name+' '+metadata.books[ii].callCode)+'</div>';
				}
			}
		}

		$(".newbook").on("click",function(){
			World.bookToFind = $(this).attr("id");
			$("#otherBooks").hide();	
			$("#findARlighthouse").show().find(".subcontent").html('<img src="'+origBook[0].thumbLighthouse+'"><img src="'+$(this).find("img").attr("src")+'">');
		});

		$(".subfooter").on("click",function(){
			$(this).parent().hide();

			if ($(this).parent().attr("id")=="findARlighthouse") {
				World.bookToFind = "";
			}
			$("#infoBox").show();
		});
	}
};

$(document).ready(function() {
	//Get collection metadata from server, replace this with your own 
	$.getJSON("https://ub-www01.uio.no/prosjekter/ar/wikitude/metadata/metadata.json", function(data) {
		
		metadata = data;

	}).done(function(){
		World.init();

	});
});