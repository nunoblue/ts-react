'use strict';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class SideBar extends Component {

    constructor(props) {
        super(props);

        this.showSidedrawer = this.showSidedrawer.bind(this);
        this.hideSidedrawer = this.hideSidedrawer.bind(this);
    }

    showSidedrawer() {
        let options = {
            onclose: () => {
                $sidedrawerEl.removeClass('active').appendTo(document.body);
            }
        }

        let $overlayEl = $(mui.overlay('on', options));

        this.$sidedrawerEl.appendTo($overlayEl);
        setTimeout(() => {
            this.$sidedrawerEl.addClass('active');
        }, 20);
    }

    hideSidedrawer() {
        this.$bodyEl.toggleClass('hide-sidedrawer');
    }

    componentDidMount() {
        this.$bodyEl = $('body');
        this.$sidedrawerEl = $('sidedrawer');
        $('.js-show-sidedrawer').on('click', this.showSidedrawer);
        $('.js-hide-sidedrawer').on('click', this.hideSidedrawer);

        this.$titleEls = $('#sidedrawer strong');
        this.$titleEls.next().hide();
        this.$titleEls.on('click', function() {
            $(this).next().slideToggle(200);
        });
    }

    render() {
        return (
            <div id="sidedrawer" className="mui--no-user-select">
                <div id="sidedrawer-brand" className="mui--appbar-line-height">
                    <span className="mui--text-title">
                        <Link to="/"><strong>ThingStar</strong></Link>
                    </span>
                </div>
                <div className="mui-divider"></div>
                <ul>
                    <li>
                        <Link to="/home"><strong>Home</strong></Link>
                        {/*<strong>Category 1</strong>
                        <ul>
                            <li><a href="#">Item 1</a></li>
                            <li><a href="#">Item 2</a></li>
                            <li><a href="#">Item 3</a></li>
                        </ul>*/}
                    </li>
                    <li>
                        <Link to="/about"><strong>About</strong></Link>
                        {/*<strong>Category 2</strong>
                        <ul>
                            <li><a href="#">Item 1</a></li>
                            <li><a href="#">Item 2</a></li>
                            <li><a href="#">Item 3</a></li>
                        </ul>*/}
                    </li>
                    <li>
                        <Link to="/dashboard"><strong>Dashboard</strong></Link>
                        {/*<strong>Category 3</strong>
                        <ul>
                            <li><a href="#">Item 1</a></li>
                            <li><a href="#">Item 2</a></li>
                            <li><a href="#">Item 3</a></li>
                        </ul>*/}
                    </li>
                </ul>
            </div>
        );
    }
}

export default SideBar;