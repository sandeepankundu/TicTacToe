var app = (function(){
	var PREFIX = "ttt";

	var _getCellId = function(rownum, colnum){
		return  [ PREFIX , "_" , rownum, "_", colnum].join("");
	};

	var _getRowSelector = function(rownum){
		return  [ PREFIX , "_" , rownum, "_", colnum].join("");
	};

	var _data  =[
	  [0,0,0],
	  [0,0,0],
	  [0,0,0]
	];
	var magicSquare =[
	  [4,9,2],
	  [3,5,7],
	  [8,1,6]
	];

	var _players = ["player1","player2"];

	var _activePlayerIdx = 0;
	var _cellClickCounter  =0;

	var _getCellScore= function( row, col){
		return magicSquare[row][col];
	};

	var _model = {
		resetData: function(){
			_data  =[
			  [0,0,0],
			  [0,0,0],
			  [0,0,0]
			];
			_activePlayerIdx =0;
			_cellClickCounter =0;
		},
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
		getActivePlayerIndex : function (argument) {
			return _activePlayerIdx;
		},
		getActivePlayer : function (argument) {
			return _players[_activePlayerIdx];
		},
		swapActivePlayer : function () {
			_activePlayerIdx = (_activePlayerIdx == 0 ? 1: 0)
		},
		setData: function(row, col){
			if(_data[row][col] ==0){
				_data[row][col] = { player: _activePlayerIdx};
				return true;
			}
			return false;
		},
		checkLogic: function(){
			//reference: http://mathworld.wolfram.com/MagicSquare.html
			//check for each player
			var weHaveWinner = false;
			var winningPlayerIndex ;
			var winningInformation = null;
			for (var i = 0; i < _players.length  && weHaveWinner==false ; i++) {
				//1.check each column
				//2. check each row
				//3. check diagonail Left-top to bottom-right
				//4. check diagonail Left-bottom to top-right
				
				//step 1:
				for (var c = 0; c < this.getCols() && weHaveWinner==false; c++ ){
					var colSum = 0;
					for (var r = 0; r < this.getRows() && weHaveWinner==false; r++ ){
						var cellData = this.getCellData(r, c);
						if(cellData!=0){
							//implies object
							if(cellData.player == i)
								colSum += _getCellScore(r, c);

							if(colSum == 15){
								weHaveWinner = true;
								winningInformation= {
									playerIndex : i,
									playerName : _players[i],
									col: c,
									windirection : 'down'
								}
							} 
						}
					}
				}

				//step 2:
				for (var r = 0; r < this.getRows() && weHaveWinner==false; r++ ){
					var rowSum = 0;
					for (var c = 0; c < this.getCols() && weHaveWinner==false; c++ ){
						var cellData = this.getCellData(r, c);
						if(cellData!=0){
							//implies object
							if(cellData.player == i)
								rowSum += _getCellScore(r, c);

							if(rowSum == 15){
								weHaveWinner = true;
								//winningPlayerIndex = i;
								winningInformation= {
									playerIndex : i,
									playerName : _players[i],
									row: r,
									windirection : 'across'
								}
							} 
						}
					}
				}


				//step 3:
				var diagonalSum = 0;
				for (var r = 0, c = 0 ; r < this.getRows() && c < this.getCols() && weHaveWinner==false; r++ , c++ ){
					var cellData = this.getCellData(r, c);
					if(cellData!=0){
						//implies object
						if(cellData.player == i)
							diagonalSum += _getCellScore(r, c);

						//if(diagonalSum == 15) weHaveWinner == true;
						if(diagonalSum == 15){
							weHaveWinner = true;
							//winningPlayerIndex = i;
							winningInformation= {
								playerIndex : i,
								playerName : _players[i],
								windirection : 'diagonal_lt_br'
							}
						} 
					}
				}

				//step 4:
				var diagonalSum = 0;
				for (var r = 0, c = this.getCols()-1 ; r < this.getRows() && c >=0 && weHaveWinner==false; r++ , c-- ){
					var cellData = this.getCellData(r, c);
					if(cellData!=0){
						//implies object
						if(cellData.player == i)
							diagonalSum += _getCellScore(r, c);

						//if(diagonalSum == 15) weHaveWinner == true;
						if(diagonalSum == 15){
							weHaveWinner = true;
							//winningPlayerIndex = i;
							winningInformation= {
								playerIndex : i,
								playerName : _players[i],
								windirection : 'diagonal_bl_tr'
							}
						}
					}
				}
			}
			console.log("We have winner : " + weHaveWinner);
			if(weHaveWinner==true){
				//console.log("Winner is : " + _players[winningPlayerIndex]);
				console.log("Winner is : " + winningInformation.playerName );
			}

			return winningInformation;
				
		}
	};

	var _fnEmpty = function(){};

	var _controller=  (function(){
		var _isInPlay= false;
		var _model,_view;

		var _fnStart = function(){
			_isInPlay = true;
			if(_model)
			{
				_model.resetData();
			}	

			if(_view){
				_view.clearBoard();
				_view.show();
			}
		};

		var _fnStop=function(){
			_isInPlay = false;
			if(_view){
				_view.hide();
			}
		};

		return {
			isInPlay: function(){
				return _isInPlay;
			},
			start: _fnStart,
			stop: _fnStop,
			playerClick: function (argument) {
				var cellData = $(this).data();
				var _activePlayer = _model.getActivePlayer();
				if(_model.setData(cellData.row, cellData.col)){
					_cellClickCounter++;
					_model.swapActivePlayer();
					_view.markTicTac(cellData.row, cellData.col, _activePlayer);
					var winnerInfo = _model.checkLogic();
					if(winnerInfo!=null ){
						_view.markWin(winnerInfo);
						_view.gameStopped();
						_view.disableEvents();
					}
					if( _cellClickCounter >= _model.getRows() * _model.getCols() ) {
						_view.gameOver();
					}
				}

			},
			bindView: function( model, view, eventhandlers){
				_model = model;
				_view = view;
				eventhandlers = eventhandlers || { };
				eventhandlers.click = this.playerClick;
				eventhandlers.gamestart = eventhandlers.gamestart || _fnEmpty;
				eventhandlers.gamestop = eventhandlers.gamestop || _fnEmpty;
				_view.bindEvent.apply(view, [model, eventhandlers]);
			}
		};
	})();

	var _view = (function(){
		var __instance_view, _model, _eventHandlers;

		var _fnBindEvents= function(){
			for (var i = 0; i < _model.getRows(); i++) {
				for (var j = 0; j < _model.getRows(); j++) {
					var _id = "#" + _getCellId(i,j);
					
					var aa =$(_id);
					aa.data({row:i,col:j});
					if(_eventHandlers.click)	aa.on('click', _eventHandlers.click);
				}
			};
			if(_eventHandlers.gamestart)		__instance_view.on('gamestart', _eventHandlers.gamestart);
			if(_eventHandlers.gamestop)			__instance_view.on('gamestop', _eventHandlers.gamestop);
			if(_eventHandlers.wehavewinner)		__instance_view.on('wehavewinner', _eventHandlers.wehavewinner);
			if(_eventHandlers.gameover)			__instance_view.on('gameover', _eventHandlers.gameover);
		};

		var _triggerGameStart= function(){
			__instance_view.trigger('gamestart');
		};

		var _triggerGameStop= function(){
			__instance_view.trigger('gamestop');
		};

		var _triggerGameOver= function(){
			__instance_view.trigger('gameover');
		};

		var _triggerWehaveWinner= function(winnerInfo){
			__instance_view.trigger('wehavewinner',winnerInfo);
		};

		var _disableEvents = function(){
			__instance_view.find("*").off();
			__instance_view.off('gamestart');
			__instance_view.off('gamestop');
			__instance_view.off('gameover');
			__instance_view.off('wehavewinner');
		};

		return {
			disableEvents:_disableEvents,
			gameStarted: _triggerGameStart,
			gameStopped: _triggerGameStop,
			gameOver: function(){
				_triggerGameOver();
				_triggerGameStop();
			},
			hide: function(){
				_disableEvents.call(this);
			},
			show: function() {
				_fnBindEvents.call(__instance_view);
				_triggerGameStart.call(this);
			},
			clearBoard: function (argument) {
				__instance_view.find('.boxstyle').removeClass("player1").removeClass("player2").removeClass('winninghighlight');
			},
			markTicTac: function (row, col, player) {
				var cell = __instance_view.find( "#" + this.getCellId.apply(this, [row, col]) );
				cell.addClass(player);
			},
			markWin: function(winnerInfo){
				var cellSelector ;
				switch(winnerInfo.windirection){
					case "across": 			 cellSelector = '._row_' + winnerInfo.row;	break;
					case "down":   			 cellSelector = '._col_' + winnerInfo.col;	break;
					case "diagonal_lt_br": 	 cellSelector = '.diagonal_lt_br' ;	break;
					case "diagonal_bl_tr": 	 cellSelector = '.diagonal_bl_tr' ;	break;
				}
				if(cellSelector!=undefined){
					$(cellSelector).addClass('winninghighlight');	
				}
				_triggerWehaveWinner.apply(this,[winnerInfo]);
			},
			getRowTpl:function(model, rownum){				
				var _fnGetAllColumns = function(model){
					var x = [];
					for(var i=0;i<model.getCols(); i++){
						x.push( this.getColTpl.apply(this, [model, rownum, i]));
					}
					return x.join("");
				};
				return [
					 "<tr>",
						_fnGetAllColumns.apply(this, [model, rownum]),
					 "</tr>"
				   ].join("");
			},
			getColTpl:function(model, rownum, colnum){
				var retVal = [
						"<td >",
						"<div id='",
							this.getCellId.apply(this, [rownum, colnum]),
						"' class='boxstyle",
						" _row_", rownum,
						" _col_", colnum,
						
						(rownum == colnum) ? " diagonal_lt_br" : "",
						(rownum == (model.getCols() - colnum -1)) ? " diagonal_bl_tr" : "",

						" '>",
						"</div>",
						"</td>"
					].join("");
				return retVal;
			},
			getTicTacToeTpl : function( model){
				var _fnGetAllRow = function(){
					var x = [];
					for(var i=0;i<model.getRows(); i++){
						x.push( this.getRowTpl.apply(this, [model, i]));
					}
					return x.join("");
				};
				return  [
					   "<div>",
						  "<table border='1' cellspacing='0'>",
							  _fnGetAllRow.apply(this,[model]),
						  "</table>",
					   "</div>"
					].join("");
			},
			getView: function(model){
				__instance_view = $(this.getTicTacToeTpl.apply(this, arguments));
				this.hide();
				return __instance_view;
			},
			bindEvent: function(model, eventhandlers){
				_model = model;
				_eventHandlers = eventhandlers;
			},
			getCellId : _getCellId
		}
	})();

	return {
			version :0.1,
			view: _view ,
			controller: _controller,
			model: _model
		}
})();

//intentionally kept it global
var appController;

$(document).ready(function (){
	$('body').append(app.view.getView(app.model));
	 appController = app.controller;

	 var events = {
	 	'gamestop' : function(){
	 		appController.stop();
		 	$('#btnPlay').val("Play");
		 },
		 'gamestart' : function(){
		 	$('#btnPlay').val("Stop");
		 	$('#result').html("");
		 },
		 'gameover': function(){
				$('#result').html("Game over.");
		 },
		 'wehavewinner':function(gameContainer, playerinfo){
		 	$('#result').html("we have a winner : " + playerinfo.playerName);
		 }
	};
	appController.bindView(app.model, app.view, events);

	var _onPlayClick = function(){
		if(appController.isInPlay()){
			appController.stop();
			//$('#btnPlay').val("Play");
		}
		else{
			appController.start();
		}
	};
	$('#btnPlay').on('click', _onPlayClick);
});