/*global define */

define(["jquery", "text!./current-selections-toolbar.css",
//mashup and extension interface
"qlik"], function($, cssContent, qlik ) {
	$("<style>").html(cssContent).appendTo("head");
	function createBtn(cmd, text) {
		return '<button class="qui-button" style="font-size:13px;" data-cmd="' + cmd + '">' + text + '</button>';
	}

	return {
		initialProperties : {
			qBookmarkListDef : {
				qType : "bookmark",
				qData : {
					title : "/title",
					description : "/description"
				}
			},
			qFieldListDef : {
			}
		},		
		definition : {
			type : "items",
			component : "accordion",
			items : {
				buttons : {
					type : "items",
					label : "App buttons",
					items : {
						clearButton : {
							ref : "buttons.clear",
							label : "ClearAll",
							type : "boolean",
							defaultValue : true
						},
						backButton : {
							ref : "buttons.back",
							label : "Back",
							type : "boolean",
							defaultValue : true
						},
						forwardButton : {
							ref : "buttons.forward",
							label : "Forward",
							type : "boolean",
							defaultValue : true
						},
						lockButton : {
							ref : "buttons.lockall",
							label : "Lock All",
							type : "boolean",
							defaultValue : false
						},
						unlockButton : {
							ref : "buttons.unlockall",
							label : "Unlock All",
							type : "boolean",
							defaultValue : false
						},
						ShowSelections : {
							ref : "selections.show",
							label : "Show Selected Values",
							type : "boolean",
							defaultValue : true
						}
					}
				},
				settings : {
					uses : "settings"
				}
			}
		},
		paint : function($element, layout) {
			$element.css('overflow', 'auto');
			$element.addClass( 'qtoolbar' );
			
			
			// Show Buttons
			var html = '', app = qlik.currApp(this);
			html += '<div class="qui-buttongroup">';
			if(layout.buttons.clear) {
				html += createBtn("clearAll", "Clear");
			}
			if(layout.buttons.back) {
				html += createBtn("back", "Back");
			}
			if(layout.buttons.forward) {
				html += createBtn("forward", "Forward");
			}
			if(layout.buttons.lockall) {
				html += createBtn("lockAll", "Lock");
			}
			if(layout.buttons.unlockall) {
				html += createBtn("unlockAll", "Unlock");
			}
			html += '</div>';
			
			$element.empty();
			$element.html(html);
			
			var divElement = $('<div>');
			$element.append(divElement);
			
			// Show Current Selections
			if(layout.selections.show) {
			
			var selections = app.getList("CurrentSelections", function(reply) {
				var mySelectedFields = reply.qSelectionObject.qSelections,
					mySelectedFieldsLength = mySelectedFields.length,
					html2 = '';
					divElement.empty();
					
				if(mySelectedFieldsLength > 0) {
						
						html2 += '<div class="csheader">Current Selections</div><div><table id="mySelections"><tr><th>Field</th><th>Count</th><th>Values</th></tr>';
					
						for (var i = 0; i < mySelectedFieldsLength; i++){
							html2 += '<tr><td>' + mySelectedFields[i].qField + '</td><td>' + mySelectedFields[i].qSelectedCount + ' of ' + mySelectedFields[i].qTotal + '</td><td>' + mySelectedFields[i].qSelected + '</td></tr>';
							}
							html2 += '</table></div>';			

				}
				else
				{ html2 += '<div class="csheader">No Current Selections</div>';

				}
				
				divElement.append(html2);
				
				}
			);
			
			
			
			}


			
			// Enable Export
			var ext = {
				support: {
					snapshot: true,
					export: true,
					exportData: true
				}
			};
				
			
					
			// Button Actions
			$element.find('button').on('qv-activate', function() {
				switch($(this).data('cmd')) {
					case 'clearAll':
						app.clearAll();
						break;
					case 'back':
						app.back();
						break;
					case 'forward':
						app.forward();
						break;
					case 'lockAll':
						app.lockAll();
						break;
					case 'unlockAll':
						app.unlockAll();
						break;
				}
			});

		}
	};
});
