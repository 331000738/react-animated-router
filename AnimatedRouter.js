import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Switch, withRouter } from 'react-router';
import PropTypes from 'prop-types';

let lastLocation = { isPush: true };
const REACT_HISTORIES_KEY = 'REACT_HISTORIES_KEY';
const histories = (sessionStorage.getItem(REACT_HISTORIES_KEY) || '').split(',').filter(Boolean);
const isHistoryPush = (location, update) => {
    const key = location.key || location.pathname + location.search;
    if (update && key !== lastLocation.key) {
        const index = histories.lastIndexOf(key);

        if (index > -1) {
            histories.splice(index + 1);
        } else {
            histories.push(key);
        }

        sessionStorage.setItem(REACT_HISTORIES_KEY, histories.join(','));

        lastLocation = {
            isPush: index < 0,
            key
        };
    }

    return lastLocation.isPush;
};

/**
 * @desc 路由动画组件
 * @author qiqiboy
 *
 *  需要动画样式文件配合，所以如果使用默认的动画效果，则需要一并将项目中的animated.css导入项目
 *  import AnimatedRouter from 'react-animated-router';
 *  import 'react-animated-router/animate.css';
 */
@withRouter
class AnimatedRouter extends Component {
    static propTypes = {
        className: PropTypes.string,
        transitionKey: PropTypes.any,
        timeout: PropTypes.number,
        prefix: PropTypes.string
    };

    static defaultProps = {
        prefix: 'animated-router'
    };

    render() {
        const { className, location, children, timeout, prefix } = this.props;

        return (
            <TransitionGroup
                className={prefix + '-container react-animated-router' + (className ? ' ' + className : '')}
                childFactory={child => {
                    const classNames =
                        prefix + '-' + (isHistoryPush(location, child.props.in) ? 'forward' : 'backward');

                    return React.cloneElement(child, {
                        classNames
                    });
                }}>
                <CSSTransition
                    key={this.props.transitionKey || location.pathname}
                    addEndListener={(node, done) => {
                        node.addEventListener(
                            'transitionend',
                            function(e) {
                                //确保动画来自于目标节点
                                if (e.target === node) {
                                    done();
                                }
                            },
                            false
                        );
                    }}
                    timeout={timeout}>
                    <Switch location={location}>{children}</Switch>
                </CSSTransition>
            </TransitionGroup>
        );
    }
}

export default AnimatedRouter;
