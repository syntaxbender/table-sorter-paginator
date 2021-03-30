var sbTableSorter = {
	arrays:{},
	sourceArrays:{},
	headers:{},
	rowCounts:{},
	sortHolder:{},
	activePages: {},
	searchInterval: {},
	renderTable: function(header,elementID,array,start){
		var tableBody = document.createElement("tbody");
		let tableHeaderRow = document.createElement("tr");
		for(let i=0;i<(header.length);i++){
			let tableCell = document.createElement("th");
			let headerDiv = document.createElement("div");
			headerDiv.setAttribute("class","sbTableSortButton");
			headerDiv.setAttribute("data-element",elementID);
			headerDiv.setAttribute("data-column",i);
			headerDiv.innerHTML = header[i]+"<img src=\"assets/img/arrow.svg\" style=\"width:13px;margin:0px 3px;\">";
			tableCell.appendChild(headerDiv);
			tableHeaderRow.appendChild(tableCell);
		}
		tableBody.appendChild(tableHeaderRow);
		for(let i=start;i<(start+this.rowCounts[elementID]);i++){
			if(array[i] == null) break;
			let tableRow = document.createElement("tr");
			for(let i2=0;i2<(header.length);i2++){
				let tableCell = document.createElement("td");
				let tableCellText = document.createTextNode(array[i][i2]);
				tableCell.appendChild(tableCellText);
				tableRow.appendChild(tableCell);
			}
			tableBody.appendChild(tableRow);
		}
		var lastPage = Math.ceil(array.length/this.rowCounts[elementID]);
		var paginationButtons = document.createElement("div");
        buttonCount = 10;
        let step = 1;
        let directionIndicator = 0;
        let currentPage = parseInt(this.activePages[elementID]);
        let slip = 0;
        let indicatorStopper = 0;
        let paginationButton = document.createElement("div");
        paginationButton.setAttribute("class","sbTablePageButton");
        paginationButton.classList.add("sbTableActivePageButton");
        paginationButton.setAttribute("data-element",elementID);
        paginationButton.setAttribute("data-pagenum",currentPage);
        paginationButton.innerHTML = currentPage;
        paginationButtons.innerHTML = paginationButton.outerHTML;
        paginationButton.setAttribute("class","sbTablePageButton");
        
       	// 0 negative direction
		// 1 pozitive direction
		console.log("##############################");
        while(step <= buttonCount-1){
            console.log(step);
            let addition = (indicatorStopper == 0) ? Math.ceil(step/2) : step;
            if(directionIndicator == 0){
                let pageNum = currentPage-addition+slip;
            	console.log(pageNum+"a");

                if(indicatorStopper == 1 && pageNum<1){
					console.log("sxxa");
                	break;
                }
                if(pageNum<1){
                    indicatorStopper = 1;
                    directionIndicator = (directionIndicator+1)%2;
                    slip = (Number.isInteger(step/2) === false) ? (Math.ceil(step/2)-1) : 0;
                    continue;
                }
                paginationButton.setAttribute("data-pagenum",pageNum);
                paginationButton.innerHTML = pageNum;
                paginationButtons.innerHTML = paginationButton.outerHTML+paginationButtons.innerHTML;
            }else{
                let pageNum = currentPage+addition-slip;
            	console.log(".."+pageNum+"b");

                if(indicatorStopper == 1 && pageNum>lastPage){
					console.log("sxxb");
					break;
                }
                if(pageNum>lastPage){
                    indicatorStopper = 1;
                    directionIndicator = (directionIndicator+1)%2;
                    slip = (Number.isInteger(step/2)) ? (Math.ceil(step/2)-1) : 0;
                    continue;
                }
                paginationButton.setAttribute("data-pagenum",pageNum);
                paginationButton.innerHTML = pageNum;
                paginationButtons.innerHTML = paginationButtons.innerHTML+paginationButton.outerHTML;
            }
            if(indicatorStopper == 0) directionIndicator = (directionIndicator+1)%2;
            step++;
        }
		/*for(let i=1;i<=totalPageNum;i++){
			let paginationButton = document.createElement("div");
			paginationButton.setAttribute("class","sbTablePageButton");
			paginationButton.setAttribute("data-element",elementID);
			paginationButton.setAttribute("data-pagenum",i);
			paginationButton.innerHTML = i;
			if(i == this.activePages[elementID]){
				paginationButton.classList.add("sbTableActivePageButton");
			}
			paginationButtons.appendChild(paginationButton);
		}*/

		document.getElementById(elementID+"-pagination").innerHTML = paginationButtons.innerHTML;
		document.getElementById(elementID).innerHTML = tableBody.innerHTML;
	},
	sort: function(elementID,column){
		if(this.sortHolder[elementID] == column){
			delete this.sortHolder[elementID];
			sortedArr = this.arrays[elementID].reverse();
		}else{
			sortedArr = this.arrays[elementID].sort(function (a, b){
			  return a[column].localeCompare(b[column]);
			});
			this.arrays[elementID] = sortedArr;
			this.sortHolder[elementID] = column;
		}
		this.activePages[elementID] = 1;
		this.renderTable(this.headers[elementID],elementID,sortedArr,0);
	},
	changePage: function(elementID,pagenum){
		this.activePages[elementID] = pagenum;
		var startID=(pagenum-1)*this.rowCounts[elementID];
		this.renderTable(this.headers[elementID],elementID,this.arrays[elementID],startID);
	},
	addItem: function(options){
		this.arrays[options.elementID] = options.array;
		this.headers[options.elementID] = options.headers;
		this.rowCounts[options.elementID] = options.rowCount;
		this.activePages[options.elementID] = 1;
	},
	run: function(){
		window.addEventListener('load', event => {
			for(index in this.headers){
				this.renderTable(this.headers[index],index,this.arrays[index],0);
				var searchDiv = document.getElementById(index+"-search");
				if(searchDiv){
					let searchInput = document.createElement("input");
					searchInput.setAttribute("class","sbTableSearchInput");
					searchInput.setAttribute("data-element",index);
					searchInput.setAttribute("type","text");
					searchDiv.innerHTML = searchInput.outerHTML;
				}
			}

			window.addEventListener('click', event => {
				if(event.target.closest(".sbTableSortButton")){
					const elementID = event.target.closest(".sbTableSortButton").getAttribute("data-element");
					const column = event.target.closest(".sbTableSortButton").getAttribute("data-column");
					sbTableSorter.sort(elementID,column);
				}else if(event.target.closest(".sbTablePageButton")){
					const elementID = event.target.closest(".sbTablePageButton").getAttribute("data-element");
					const pagenum = event.target.closest(".sbTablePageButton").getAttribute("data-pagenum");
					sbTableSorter.changePage(elementID,pagenum);
				}
			});
			window.addEventListener('keyup', event => {
				if(event.target.closest(".sbTableSearchInput")){
					var searchWord = event.target.value;
					var elementID = event.target.getAttribute("data-element");
					if(this.searchInterval[elementID]) clearInterval(this.searchInterval[elementID]);
					this.searchInterval[elementID] = setInterval(function(){ sbTableSorter.intervalDone(elementID,searchWord) }, 200);
				}
			});
		});
	},
	escapeRegExp: function(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	},
	intervalDone: function(elementID,searchWord){
		this.search(elementID,searchWord);
		clearInterval(this.searchInterval[elementID]);
	},
	search: function(elementID,searchWord){
		if(searchWord.length>=3){
			if(this.sourceArrays[elementID]){
				var sourceArray = this.sourceArrays[elementID];
			}else{
				var sourceArray = this.arrays[elementID];
				this.sourceArrays[elementID] = this.arrays[elementID];
			}
			var searchedArray = [];
			for(let i=0; i<sourceArray.length;i++){
				for(let i2=0; i2<sourceArray[i].length;i2++){
					console.log(sourceArray[i][i2]+"");
					var res = new RegExp("^.*"+this.escapeRegExp(searchWord)+".*$").exec(sourceArray[i][i2]);
					if(res){
						console.log("ok");
						searchedArray.push(sourceArray[i]);
						break;
					}
				}
			}
			if(searchedArray.length<1){
				this.arrays[elementID] = this.sourceArrays[elementID];
			}else{
				this.arrays[elementID] = searchedArray;
				this.activePages[elementID] = 1;
				this.renderTable(this.headers[elementID],elementID,searchedArray,0);
			}
		}else if(searchWord.length==0) {
			if(this.sourceArrays[elementID]) this.arrays[elementID] = this.sourceArrays[elementID];
			this.activePages[elementID] = 1;
			this.renderTable(this.headers[elementID],elementID,this.arrays[elementID],0);
		}
	}
}