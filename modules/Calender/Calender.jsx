import React from 'react';
import ReactDOM from 'react-dom';


let util = {
	formatDate(date, regText) {
		var o = {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate()
		};
		switch (regText) {
			case 'yyyy':
				return o.year;
			case 'mm':
				return o.month;
			case 'dd':
				return o.day;
			default:
				return o.year + '-' + o.month + '-' + o.day;
		}
	}
};
class CalShow extends React.Component {
	constructor(props) {
	    super(props);
	}
	handleClick(e) {
		e.stopPropagation();
		e.preventDefault();
		e.nativeEvent.stopImmediatePropagation();
		$('.cal-panel').toggle();
	}
	componentDidMount() {
		$(document).on('click', function(e){
            e.preventDefault();
            $('.cal-panel').hide();
        });
	}
	render() {
		return (
			<div className="cal-show">
				<span>{util.formatDate(this.props.fromdate)}-{util.formatDate(this.props.enddate)}</span>
				<a href="" className="cal-btn" onClick={this.handleClick}></a>
			</div>
		);
	};
}
class CalHeader extends React.Component {
	constructor(props) {
	    super(props);

		this.state = {
			month: this.props.month,
			year: this.props.year,
			fromdate: this.props.fromdate,
			enddate: this.props.enddate
		}
	    this.handleLeftClick = this.handleLeftClick.bind(this);
	    this.handleRightClick = this.handleRightClick.bind(this);
	}
	handleLeftClick(e) {
		e.preventDefault();
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		var newMonth = this.props.month - 1;
		var year = this.props.year;
		var day = this.props.day;

		if(newMonth < 1){
			year --;
			newMonth = 12;
		}
		this.state.month = newMonth;
		this.state.year = year;
		if (this.props.name === 'from') {
			this.state.fromdate = new Date(year, newMonth - 1, day);
			this.state.enddate = this.props.enddate;
		} else {
			this.state.fromdate = this.props.fromdate;
			this.state.enddate = new Date(year, newMonth - 1, day);
			if(this.state.fromdate.getTime() > this.state.enddate.getTime()) {
				this.state.fromdate = this.state.enddate;
			}
		}
		this.setState(this.state);
		this.props.updateFilter(year, newMonth);
		this.props.updateCtrlFilter(this.state.fromdate, this.state.enddate);
	}
	handleRightClick(e) {
		e.preventDefault();
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		var newMonth = this.props.month + 1;
		var year = this.props.year;
		var day = this.props.day;

		if( newMonth > 12 ){
			year ++;
			newMonth = 1;
		}

		this.state.month = newMonth;
		this.state.year = year;
		if (this.props.name === 'from') {
			this.state.fromdate = new Date(year, newMonth - 1, day);
			this.state.enddate = this.props.enddate;
			if(this.state.fromdate.getTime() > this.state.enddate.getTime()) {
				this.state.enddate = this.state.fromdate;
			}
		} else {
			this.state.fromdate = this.props.fromdate;
			this.state.enddate = new Date(year, newMonth - 1, day);
		}
		this.setState(this.state);
		// 子组件变化渲染到父组件
		this.props.updateFilter(year, newMonth);
		this.props.updateCtrlFilter(this.state.fromdate, this.state.enddate);
	}
	showYearList(e) {
		e.preventDefault();
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		var $yearList = $(e.target).parent().find('.header-year-list');
		$yearList.toggle();
	}
	showMonthList(e) {
		e.preventDefault();
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		var $monthList = $(e.target).parent().find('.header-month-list');
		$monthList.toggle();
	}
	render() {
		let yearArray = [];
		let monthArray = [];
		for (let i = 1950; i < 2051; i++) {
			yearArray.push(<li key={i}>{i}</li>);
		}
		for (let y = 1; y < 13; y++) {
			monthArray.push(<li key={y}>{y}</li>);
		}

		return (
			<div className="header">
				<a href="" className="header-before" onClick={this.handleLeftClick}>before</a>
				<div className="header-year">
					<span onClick={this.showYearList}>{this.props.year}年</span>
					<ul className="header-year-list">{yearArray}</ul>
				</div>

				<div className="header-month">
					<span onClick={this.showMonthList}>{this.props.month}月</span>
					<ul className="header-month-list">{monthArray}</ul>
				</div>
				<a href="" className="header-after" onClick={this.handleRightClick}>after</a>
			</div>
		);
	};
}
class CalBody extends React.Component {
	constructor(props) {
	    super(props);
	    this.handleDayClick = this.handleDayClick.bind(this);
	}
	getMonthDays() {
		var year = this.props.year;
		var month = this.props.month;
		var temp = new Date(year, month, 0);
		return temp.getDate();
	}
	getFirstDayWeek() {
		var year = this.props.year;
		var month = this.props.month - 1;
		var dt = new Date(year, month, 1);
		var weekdays = dt.getDay();
		return weekdays;
	}
	handleDayClick(e) {
		e.preventDefault();
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		var filterfrom = this.props.fromdate;
		var filterend = this.props.enddate;
		// 点击日期，变更dur的时间
		if (this.props.name === 'from') {
			filterfrom = new Date(this.props.year + ',' + this.props.month + ',' + $(e.target).attr('data-key'));
			if(filterfrom.getTime() > filterend.getTime()) {
				filterend = filterfrom;
			}
		} else {
			filterend = new Date(this.props.year + ',' + this.props.month + ',' + $(e.target).attr('data-key'));
			if(filterend.getTime() < filterfrom.getTime()) {
				filterfrom = filterend;
			}
		}
		this.props.updateCtrlFilter(filterfrom, filterend);
	}
	render() {
		var arry1 =[];
		var arry2 = [];
		var getDays = this.getMonthDays();
		var	FirstDayWeek = this.getFirstDayWeek();
		var	day = this.props.day;
		var fromdate = util.formatDate(this.props.fromdate);
		var enddate = util.formatDate(this.props.enddate);
		var fromyear = util.formatDate(this.props.fromdate, 'yyyy');
		var endyear = util.formatDate(this.props.enddate, 'yyyy');
		var frommonth = util.formatDate(this.props.fromdate, 'mm');
		var endmonth = util.formatDate(this.props.enddate, 'mm');
		var fromday = util.formatDate(this.props.fromdate, 'dd');
		var endday = util.formatDate(this.props.enddate, 'dd');
		for(var i = 0; i < FirstDayWeek; i++ ){
			arry1[i] = i;
		}
		for(var i = 0; i < getDays; i++ ){
			arry2[i] = (i + 1);
		}
		var node1 = arry1.map(function(item){
			return <li key={item} onClick={this.handleDayClick}></li>
		}.bind(this));
		var node2 = arry2.map(function(item){
			if (day === item) {
				return <li className="on" key={item} data-key={item}>{item}</li>
			} else if (this.props.name === 'from' && fromdate !== enddate && frommonth !== endmonth && item > fromday) {
				return <li key={item} className="dur" data-key={item} onClick={this.handleDayClick}>{item}</li>
			} else if (this.props.name === 'end' && fromdate !== enddate && frommonth !== endmonth && item < endday) {
				return <li key={item} className="dur" data-key={item} onClick={this.handleDayClick}>{item}</li>
			} else if (this.props.name === 'from' && fromdate !== enddate && frommonth == endmonth && item <= endday && item > fromday) {
				return <li key={item} className="dur" data-key={item} onClick={this.handleDayClick}>{item}</li>
			} else if (this.props.name === 'end' && fromdate !== enddate && frommonth == endmonth && item >= fromday && item < endday) {
				return <li key={item} className="dur" data-key={item} onClick={this.handleDayClick}>{item}</li>
			} else {
				return <li key={item} data-key={item} onClick={this.handleDayClick}>{item}</li>
			}
		}.bind(this));

		return (
			<div className="cal-body">
				<ul className="weekday">
					<li>日</li>
					<li>一</li>
					<li>二</li>
					<li>三</li>
					<li>四</li>
					<li>五</li>
					<li>六</li>
				</ul>
				<ul className="day">
					{node1}{node2}
				</ul>
			</div>
		);
	};
}
class CalFooter extends React.Component {
	constructor(props) {
		super(props);
		this.handleComfirm = this.handleComfirm.bind(this);
		this.handleCancle = this.handleCancle.bind(this);
	}
	handleComfirm(e) {
		e.preventDefault();
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		var fromdate = Date.parse(this.props.fromdate) / 1000;
		var enddate = Date.parse(this.props.enddate) / 1000;
		console.log(fromdate + '-' + enddate);
		$('.cal-panel').hide();
	}
	handleCancle(e) {
		e.preventDefault();
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
		$('.cal-panel').hide();
	}
	render() {
		return (
			<div className="cal-footer">
				<a href="" onClick={this.handleComfirm}>确定</a>
				<a href="" onClick={this.handleCancle}>取消</a>
			</div>
		);
	}
}
class CalWrap extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
	    	day: (new Date()).getDate()
	    };
	    this.handleFilterUpdate = this.handleFilterUpdate.bind(this);
	}
	renderDate() {
		if (this.props.name === 'from') {
			return this.props.fromdate;
		} else {
			return this.props.enddate;
		}
	}
	// CalHeader改变值，渲染到父组件CalWrap元素，最终通过state方式传递给CalBody组件
	handleFilterUpdate(filterYear, filterMonth) {
	    this.setState({
	     	year: filterYear,
	     	month: filterMonth
	    });
	}
	render() {
		return (
			<div className='cal-wrap'>
				<CalHeader
					year={util.formatDate(this.renderDate(), 'yyyy')}
					month={util.formatDate(this.renderDate(), 'mm')}
					fromdate={this.props.fromdate}
					enddate={this.props.enddate}
					name={this.props.name}
					day={this.state.day}
					updateFilter={this.handleFilterUpdate}
					updateCtrlFilter = {this.props.updateCtrlFilter}
				/>
				<CalBody
					year={util.formatDate(this.renderDate(), 'yyyy')}
					month={util.formatDate(this.renderDate(), 'mm')}
					day = {util.formatDate(this.renderDate(), 'dd')}
					fromdate={this.props.fromdate}
					enddate={this.props.enddate}
					name={this.props.name}
					// 继承父组件CalControl元素方法，以方便CalShow组件更新日期
					updateCtrlFilter = {this.props.updateCtrlFilter}
				/>
			</div>
		);
	}
}
class CalControl extends React.Component {
	constructor(props) {
		super(props);
		var enddate = new Date();
		var year = enddate.getFullYear();
		var endmonth = enddate.getMonth() - 1;
		var day = enddate.getDate();
		var fromdate = new Date(year, endmonth, day);
		this.state = {
			fromdate: fromdate,
			enddate: enddate
		};
		this.updateCtrlFilter = this.updateCtrlFilter.bind(this);
	}
	updateCtrlFilter(filterfrom, filterend) {
		this.setState({
	    	enddate: filterend,
	    	fromdate: filterfrom
	    });
	}
	render() {

		return (

			<div className="cal">
				<CalShow
					fromdate={this.state.fromdate}
					enddate={this.state.enddate}
				/>
				<div className="cal-panel">
					<CalWrap
						name="from"
						fromdate={this.state.fromdate}
						enddate={this.state.enddate}
						updateCtrlFilter={this.updateCtrlFilter}
					/>
					<CalWrap
						name="end"
						fromdate={this.state.fromdate}
						enddate={this.state.enddate}
						updateCtrlFilter={this.updateCtrlFilter}
					/>
					<CalFooter
						fromdate={this.state.fromdate}
						enddate={this.state.enddate}
					/>
				</div>
			</div>
		);
	}
}
ReactDOM.render(<CalControl />, $('#root')[0]);
