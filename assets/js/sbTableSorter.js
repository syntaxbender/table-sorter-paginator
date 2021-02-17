var sbTableSorter = {
	arrays: {},
	headers:{},
	rowCounts:{},
	sortHolder:{},
	activePages: {},
	renderTable: function(header,elementID,array,start){
		var tableBody = document.createElement("tbody");
		let tableHeaderRow = document.createElement("tr");
		for(let i=0;i<(header.length);i++){
			let tableCell = document.createElement("th");
			let headerDiv = document.createElement("div");
			headerDiv.className="sbTableSortButton";
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
		var totalPageNum = Math.ceil(array.length/this.rowCounts[elementID]);
		var paginationButtons = document.createElement("div");
		for(let i=1;i<=totalPageNum;i++){
			let paginationButton = document.createElement("div");
			paginationButton.className = "sbTablePageButton";
			paginationButton.setAttribute("data-element",elementID);
			paginationButton.setAttribute("data-pagenum",i);
			paginationButton.innerHTML = i;
			if(i == this.activePages[elementID]){
				paginationButton.classList.add("sbTableActivePageButton");
			}
			paginationButtons.appendChild(paginationButton);
		}
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
		});
	},
	/*search: function(elementID,search){ // it will be next release.

	},*/
} 
