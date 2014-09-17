var app = (function(){

			var _controller=  (function(){
				var _isInPlay= false;
			
				return {
					isInPlay: function(){
						return _isInPlay;
					},
					start: function(){
						_isInPlay = true;
					},
					stop: function(){
						_isInPlay = false;
					},
					bindView: function( model, view ){
						
					}
				};
			})();
			return {
			version :0.1,
			view: {
				getRowTpl:function(model, rownum){				
					var _fnGetAllColumns = function(model){
						var x = [];
						for(var i=1;i<=model.getCols(); i++){
							x.push( this.getColTpl.apply(this, [model, rownum, i]));
						}
						return x.join("");
					};
					return [
							 "<tr>",
								_fnGetAllColumns.apply(this, [model, rownum]),//this.getColTpl(),
							 "</tr>"
						   ].join("");
				},
				getColTpl:function(model, rownum, colnum){
					var retVal = [
							"<td class='boxstyle'>",
							"<span id='",
								this.getCellId.apply(this, [rownum, colnum]),
							"'>",
							"&nbsp;&nbsp;&nbsp;&nbsp;" ,
							"row: " , rownum, " col: " , colnum,
							"</span>",
							"</td>"
						].join("");
					return retVal;
				},
				getTicTacToeTpl : function( model){
					var _fnGetAllRow = function(){
						var x = [];
						for(var i=1;i<=model.getRows(); i++){
							x.push( this.getRowTpl.apply(this, [model, i]));
						}
						return x.join("");
					};
					return  [
						   "<div>",
							  "<table border='1'>",
								  _fnGetAllRow.apply(this,[model]),//this.getRowTpl(),
							  "</table>",
						   "</div>"
						].join("");
				},
				applyBoxClicked: function(){
					
				},
				getCellId : function(rownum, colnum){
					var prefix = "ttt";
					return  [ prefix , "_" , rownum, "_", colnum].join("");
				}
			},
			controller: _controller,
			model: {
				_data:[
				  [0,0,0],
				  [0,0,0],
				  [0,0,0]
				],
				getRows: function(){
					return 3;
				},
				getCols: function(){
					return 3;
				},
				getData: function(){
					return _data;
				},
				getCellData: function(row, col){
					return _data[row][col];
				},
				checkLogic: function(){
				
				}
			},
			events:{
				boxClick: function( ){
					
				},
			}
		}
})();

$(document).ready(function (){
	$('body').append(app.view.getTicTacToeTpl(app.model));
	 var appController = app.controller;
	var _onPlayClick = function(){
		if(appController.isInPlay()){
			appController.stop();
			$('#btnPlay').val("Play");
		}
		else{
			appController.start();
			$('#btnPlay').val("Stop");
		}
	};
	$('#btnPlay').click ( _onPlayClick);
	
	//alert( app.view.getTicTacToeTpl());
	/*
	$(".boxclick").data({ r:1,c: 3});
	
	$(".boxclick").bind('click',function(){
		//console.log("");
		var xx = $(".boxclick").data();
		alert("row:  " + xx.r  + " col : " + xx.c);
	});*/
});