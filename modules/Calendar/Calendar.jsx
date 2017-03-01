import React from 'react';
import ReactDOM from 'react-dom';

let util = {
    formatDate(date, regText) {
        let o = {
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
    },
    addEvent(element, evnt, funct){
        if (element.attachEvent)
            return element.attachEvent('on' + evnt, funct);
        else
            return element.addEventListener(evnt, funct, false);
    },
    /**
     * 判断闰年函数
     * @param  {number} year 要判断的年份
     * @return {bool} 返回布尔值
     *
     * 其实只要满足下面几个条件即可、
     * 1.普通年能被4整除且不能被100整除的为闰年。如2004年就是闰年,1900年不是闰年
     * 2.世纪年能被400整除的是闰年。如2000年是闰年，1900年不是闰年
     */
    leapYear(year) {
        return !(year % (year % 100 ? 4 : 400));
    },
    howMuchDaysOfMonth(now) {
        var year = now.getFullYear();
        var month = now.getMonth();
        var day = 1;

        var nextMonth = (month + 1 < 12) ? month + 1
            : (function () {
            ++year;
            return 0;
        }());

        var d = new Date(year, nextMonth, 1);
        d.setTime(d.getTime() - 24 * 3600 * 1000);
        return d.getDate();
    },
    prevMonth(t) {
        let year = t.getFullYear();
        let month = t.getMonth();
        let day = t.getDate();

        let prevMonth = month - 1 > -1 ? month - 1 : (function () {
            --year;
            return 11;
        })();
        return new Date(year, prevMonth, day);
    },
    nextMonth(t) {
        let year = t.getFullYear();
        let month = t.getMonth();
        let day = t.getDate();

        let nextMonth = month + 1 < 12 ? month + 1
            : (function () {
            ++year;
            return 0;
        }());

        return new Date(year, nextMonth, day);
    },
    today() {
        let t = new Date();
        t.setHours(0);
        t.setMinutes(0);
        t.setSeconds(0);
        t.setMilliseconds(0);
        return t;
    },
    nextDay(t) {
        let temp = new Date(t);
        temp.setTime(t.getTime() + 24 * 3600 * 1000);
        return temp;
    },
    prevDay(t) {
        let temp = new Date(t);
        temp.setTime(t.getTime() - 24 * 3600 * 1000);
        return temp;
    }
};
class CalShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPanelShow: false
        }
    }
    handleClick(e) {
        e.stopPropagation();
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();

        this.props.updatePanelActive(!this.props.isPanelShow);
    }
    render() {
        let isActiveORShow = '';

        // console.log('state:' + this.state.isPanelShow);
        if (this.props.styleName === '') {
            isActiveORShow = '';

        } else {
            if (this.props.isPanelShow) {
                isActiveORShow = 'show';
            } else {
                isActiveORShow = 'active';
            }
        }

        return (
            <div className="cal-show">
                <span className={'cal-show-span ' + this.props.styleName}>{util.formatDate(this.props.fromdate)}-{util.formatDate(this.props.enddate)}</span>
                <a href="" className={'cal-btn ' +  isActiveORShow} onClick={this.handleClick.bind(this)}></a>
            </div>
        );
    };
}
class CalFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fromdate: this.props.fromdate,
            enddate: this.props.enddate
        }
        this.filterYesterday = this.filterYesterday.bind(this);
        this.filterToday = this.filterToday.bind(this);
        this.filterNearSevendays = this.filterNearSevendays.bind(this);
        this.filterLastWeek = this.filterLastWeek.bind(this);
        this.filterLastMonth = this.filterLastMonth.bind(this);
        this.filterLastQuarter = this.filterLastQuarter.bind(this);
        this.filterThisMonth = this.filterThisMonth.bind(this);
    }
    filterYesterday(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        let from = this.state.fromdate;
        let end = this.state.enddate;

        end = util.prevDay(util.today());
        end.setHours(23);
        from = new Date(end);
        from.setHours(0);

        this.props.updateCtrlFilter(from, end);
    }
    filterToday(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        let from = this.state.fromdate;
        let end = this.state.enddate;

        from = util.today();
        end = new Date(from);
        end.setHours(23);

        this.props.updateCtrlFilter(from, end);
    }
    filterNearSevendays(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        let from = this.state.fromdate;
        let end = this.state.enddate;

        end = util.today();
        from = (function () {
            let t = end;
            for (let i = 0; i < 6; i++) {
                t = util.prevDay(t);
            }
            return t;
        })();
        end.setHours(23);

        this.props.updateCtrlFilter(from, end);
    }
    filterLastWeek(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        let from = this.state.fromdate;
        let end = this.state.enddate;

        end = (function () {
            let s = util.today();
            let day = s.getDay();
            for (let i = 0; i < day; i++) {
                s = util.prevDay(s);
            }
            return s;
        })();

        from = (function () {
            let t = end;
            for (let i = 0; i < 6; i++) {
                t = util.prevDay(t);
            }
            return t;
        })();
        from.setHours(23);

        this.props.updateCtrlFilter(from, end);
    }
    filterThisMonth(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        let from = this.state.fromdate;
        let end = this.state.enddate;

        let now = util.today();
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(from);
        end.setDate(util.howMuchDaysOfMonth(end));
        end.setHours(23);

        this.props.updateCtrlFilter(from, end);
    }
    filterLastMonth(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        let from = this.state.fromdate;
        let end = this.state.enddate;

        let now = util.today();
        end = util.prevMonth(new Date(now.getFullYear(), now.getMonth(), 1));
        end.setDate(util.howMuchDaysOfMonth(end));
        from = new Date(end);
        from.setDate(1);
        from.setHours(0);

        this.props.updateCtrlFilter(from, end);
    }
    filterLastQuarter(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        let from = this.state.fromdate;
        let end = this.state.enddate;

        let x = util.today();
        // 将字符串转化为整数
        let nowSeason = ~~(x.getMonth() / 3);
        let year = x.getFullYear();
        nowSeason = nowSeason - 1 > 0 ? nowSeason - 1 : (function () {
            year--;
            return 3;
        })();
        from = new Date(year, nowSeason * 3, 1);
        end = from;
        end = util.nextMonth(end);
        end = util.nextMonth(end);
        end.setDate(util.howMuchDaysOfMonth(end));
        end.setHours(23);

        this.props.updateCtrlFilter(from, end);
    }
    render () {
        return (
            <div className="cal-filter">
                <span onClick={this.filterYesterday}>昨天</span>
                <span onClick={this.filterToday}>今天</span>
                <span onClick={this.filterNearSevendays}>最近7天</span>
                <span onClick={this.filterLastWeek}>上周</span>
                <span onClick={this.filterThisMonth}>本月</span>
                <span onClick={this.filterLastMonth}>上个月</span>
                <span onClick={this.filterLastQuarter}>上个季度</span>
            </div>
        );
    }
}
class CalHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            month: this.props.month,
            year: this.props.year,
            fromdate: this.props.fromdate,
            enddate: this.props.enddate,
            isMonthShow: false,
            isYearShow: false
        }
        this.handleLeftClick = this.handleLeftClick.bind(this);
        this.handleRightClick = this.handleRightClick.bind(this);
        this.showYearList = this.showYearList.bind(this);
        this.showMonthList = this.showMonthList.bind(this);
        this.changeYearOrMonth = this.changeYearOrMonth.bind(this);
    }
    handleLeftClick(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        let newMonth = this.props.month - 1;
        let year = this.props.year;
        let day = this.props.day;
        let fromdate = '';
        let enddate = '';



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
        // this.setState(this.state);
        this.setState({
            year: year,
            month: newMonth,
            fromdate: fromdate,
            enddate: enddate
        });
        this.props.updateFilter(year, newMonth);
        this.props.updateCtrlFilter(this.state.fromdate, this.state.enddate);
    }
    handleRightClick(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        let newMonth = this.props.month + 1;
        let year = this.props.year;
        let day = this.props.day;
        let fromdate = '';
        let enddate = '';

        if( newMonth > 12 ){
            year ++;
            newMonth = 1;
        }

        // this.state.month = newMonth;
        // this.state.year = year;

        if (this.props.name === 'from') {
            fromdate = new Date(year, newMonth - 1, day);
            enddate = this.props.enddate;
            if(fromdate.getTime() > enddate.getTime()) {
                enddate = fromdate;
            }
        } else {
            fromdate = this.props.fromdate;
            enddate = new Date(year, newMonth - 1, day);
        }
        this.setState({
            year: year,
            month: newMonth,
            fromdate: fromdate,
            enddate: enddate
        });
        // 子组件变化渲染到父组件
        this.props.updateFilter(year, newMonth);
        this.props.updateCtrlFilter(fromdate, enddate);
    }
    showYearList(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        // let $yearList = e.target.parentElement.querySelector('.header-year-list');
        this.setState({
            isYearShow: !this.state.isYearShow
        });
    }
    showMonthList(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        // let $monthList = e.target.parentElement.querySelector('.header-month-list');
        // $monthList.toggle();
        this.setState({
            isMonthShow: !this.state.isMonthShow
        });
    }
    changeYearOrMonth(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        // 子组件变化渲染到父组件
        let year = '';
        let month = '';
        let fromdate = '';
        let enddate = '';
        let day = this.props.day;

        if (e.target.dataset.type == 'year') {
            year = e.target.dataset.key;
            month = this.state.month;
        } else {
            year = this.state.year;
            month = e.target.dataset.key;
        }
        if (this.props.name === 'from') {
            fromdate = new Date(year, month - 1, day);
            enddate = this.props.enddate;
            if(fromdate.getTime() > enddate.getTime()) {
                enddate = fromdate;
            }
        } else {
            fromdate = this.props.fromdate;
            enddate = new Date(year, month - 1, day);
            if(fromdate.getTime() > enddate.getTime()) {
                fromdate = enddate;

            }
        }
        this.setState({
            year: year,
            month: month,
            fromdate: fromdate,
            enddate: enddate
        });

        this.props.updateCtrlFilter(fromdate, enddate);
        this.props.updateFilter(year, month);
        this.setState({
            isMonthShow: false,
            isYearShow: false
        });
    }
    componentDidMount() {
        util.addEvent(document, 'click', ()=>{
            if (this.state.isMonthShow) {
                this.setState({
                    isMonthShow: false
                });
            }
            if (this.state.isYearShow) {
                this.setState({
                    isYearShow: false
                });
            }
        });
    }
    render() {
        let yearArray = [];
        let monthArray = [];
        let isMonthShow = this.state.isMonthShow ? { display: 'block' } : { display: 'none'};
        let isYearShow = this.state.isYearShow ? { display: 'block' } : { display: 'none'};

        for (let i = 2010; i < 2051; i++) {
            yearArray.push(<li key={i}
                onClick={this.changeYearOrMonth}
                data-key={i}
                data-type='year'
                className="header-year-list-item">{i}</li>);
        }
        for (let y = 1; y < 13; y++) {
            monthArray.push(<li key={y}
                onClick={this.changeYearOrMonth}
                data-key={y}
                data-type="month"
                className="header-month-list-item">{y}</li>);
        }

        return (
            <div className="header">
                <a href="" className="header-before" onClick={this.handleLeftClick}>before</a>
                <div className="header-year">
                    <span onClick={this.showYearList}>{this.props.year}年</span>
                    <ul className="header-year-list" style={isYearShow}>{yearArray}</ul>
                </div>

                <div className="header-month">
                    <span onClick={this.showMonthList}>{this.props.month}月</span>
                    <ul className="header-month-list" style={isMonthShow}>{monthArray}</ul>
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
        let year = this.props.year;
        let month = this.props.month;
        let temp = new Date(year, month, 0);
        return temp.getDate();
    }
    getFirstDayWeek() {
        let year = this.props.year;
        let month = this.props.month - 1;
        let dt = new Date(year, month, 1);
        let weekdays = dt.getDay();
        return weekdays;
    }
    handleDayClick(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        let filterfrom = this.props.fromdate;
        let filterend = this.props.enddate;
        // 点击日期，变更dur的时间
        if (this.props.name === 'from') {
            filterfrom = new Date(this.props.year + ',' + this.props.month + ',' + e.target.dataset.key);
            if(filterfrom.getTime() > filterend.getTime()) {
                filterend = filterfrom;
            }
        } else {
            filterend = new Date(this.props.year + ',' + this.props.month + ',' + e.target.dataset.key);
            if(filterend.getTime() < filterfrom.getTime()) {
                filterfrom = filterend;
            }
        }
        this.props.updateCtrlFilter(filterfrom, filterend);
    }
    render() {
        let arry1 =[];
        let arry2 = [];
        let getDays = this.getMonthDays();
        let FirstDayWeek = this.getFirstDayWeek();
        let day = this.props.day;
        let fromdate = util.formatDate(this.props.fromdate);
        let enddate = util.formatDate(this.props.enddate);
        let fromyear = util.formatDate(this.props.fromdate, 'yyyy');
        let endyear = util.formatDate(this.props.enddate, 'yyyy');
        let frommonth = util.formatDate(this.props.fromdate, 'mm');
        let endmonth = util.formatDate(this.props.enddate, 'mm');
        let fromday = util.formatDate(this.props.fromdate, 'dd');
        let endday = util.formatDate(this.props.enddate, 'dd');
        for(let i = 0; i < FirstDayWeek; i++ ){
            arry1[i] = i;
        }
        for(let i = 0; i < getDays; i++ ){
            arry2[i] = (i + 1);
        }
        let node1 = arry1.map(function(item){
            return <li key={item} onClick={this.handleDayClick}></li>
        }.bind(this));
        let node2 = arry2.map(function(item){

            if (day === item) {
                return <li className="on" key={item} data-key={item}>{item}</li>
            } else if (this.props.name === 'from' && fromyear === endyear && frommonth === endmonth && fromday !== endday && item > fromday && item <= endday) {
                // 同年同月不同日，大于开始时间，小于结束时间
                return <li key={item} className="dur" data-key={item} onClick={this.handleDayClick}>{item}</li>
            } else if (this.props.name === 'from' && frommonth !== endmonth && item > fromday && item <= getDays) {
                //同年不同月，大于开始时间，小于这个月结束
                return <li key={item} className="dur" data-key={item} onClick={this.handleDayClick}>{item}</li>
            } else if (this.props.name === 'from' && fromyear !== endyear && item > fromday && item <= getDays) {
                // 不同年同月或不同月不同日或同日，大于开始时间，小于结束时间
                return <li key={item} className="dur" data-key={item} onClick={this.handleDayClick}>{item}</li>
            } else if (this.props.name === 'end' && fromyear === endyear && frommonth === endmonth && fromday !== endday && item >= fromday && item < endday) {
                // 同年同月不同日，大于开始时间，小于结束时间
                return <li key={item} className="dur" data-key={item} onClick={this.handleDayClick}>{item}</li>
            } else if (this.props.name === 'end' && fromyear === endyear && frommonth !== endmonth && item >= 1 && item < endday) {
                // 同年不同月同日或者不同日，大于第一天，小于结束时间
                return <li key={item} className="dur" data-key={item} onClick={this.handleDayClick}>{item}</li>
            } else if (this.props.name === 'end' && fromyear !== endyear && item >= 1 && item < endday) {
                // 只要不同年，大于开始时间，小于这个月结束(如果结束日期是第一天不处理)
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
        let fromdate = Date.parse(this.props.fromdate) / 1000;
        let enddate = Date.parse(this.props.enddate) / 1000;
        console.log(fromdate + '-' + enddate);
        this.props.updatePanelActive(!this.props.isPanelShow);
        // this.props.sendIsPanelShow(false);
    }
    handleCancle(e) {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.props.updatePanelActive(!this.props.isPanelShow);
        // this.props.sendIsPanelShow(false);
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
            // day: (new Date()).getDate()
            // 默认向左和向右翻页的时候从第一天开始
            day: 1
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
        let fromdate = new Date();
        let year = fromdate.getFullYear();
        let endmonth = fromdate.getMonth() + 1;
        let day = fromdate.getDate();
        let enddate = new Date(year, endmonth, 1);
        this.state = {
            fromdate: fromdate,
            enddate: enddate,
            isPanelShow: false
        };
        this.updateCtrlFilter = this.updateCtrlFilter.bind(this);
        this.updatePanelActive = this.updatePanelActive.bind(this);
    }
    updateCtrlFilter(filterfrom, filterend) {
        this.setState({
            enddate: filterend,
            fromdate: filterfrom
        });
    }
    updatePanelActive(isShow) {
        this.setState({
            isPanelShow: isShow
        });
    }
    componentDidMount() {
        util.addEvent(document, 'click', ()=>{
            if (this.state.isPanelShow) {
                this.setState({
                    isPanelShow: false
                });
            }
        });
    }
    render() {
        let panelStyle = this.state.isPanelShow ? {display: 'block'} : {display: 'none'};

        return (

            <div className="cal">
                <CalShow
                    fromdate = {this.state.fromdate}
                    enddate = {this.state.enddate}
                    isPanelShow = {this.state.isPanelShow}
                    updatePanelActive = {this.updatePanelActive}
                />
                <div className = "cal-panel" style = {panelStyle}>
                    <CalFilter
                        fromdate = {this.state.fromdate}
                        enddate = {this.state.enddate}
                        updateCtrlFilter = {this.updateCtrlFilter}
                    />
                    <CalWrap
                        name = "from"
                        fromdate = {this.state.fromdate}
                        enddate = {this.state.enddate}
                        updateCtrlFilter = {this.updateCtrlFilter}
                    />
                    <CalWrap
                        name = "end"
                        fromdate = {this.state.fromdate}
                        enddate = {this.state.enddate}
                        updateCtrlFilter = {this.updateCtrlFilter}
                    />
                    <CalFooter
                        fromdate = {this.state.fromdate}
                        enddate = {this.state.enddate}
                        isPanelShow = {this.state.isPanelShow}
                        updatePanelActive = {this.updatePanelActive}
                    />
                </div>
            </div>
        );
    }
}
ReactDOM.render(<CalControl />, document.querySelector('#root'));