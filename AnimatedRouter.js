import React, { Component } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Switch, withRouter } from 'react-router';
import PropTypes from 'prop-types';

let throttleTimer;
const REACT_HISTORIES_KEY = 'REACT_HISTORIES_KEY';
const histories = (sessionStorage.getItem(REACT_HISTORIES_KEY) || '').split(',').filter(Boolean);
const isHistoryPush = location => {
    const index = histories.lastIndexOf(location.key);

    clearTimeout(throttleTimer);

    throttleTimer = setTimeout(function() {
        if (index > -1) {
            histories.splice(index + 1);
        } else {
            histories.push(location.key);
        }

        sessionStorage.setItem(REACT_HISTORIES_KEY, histories.join(','));
    }, 50);

    return index < 0;
};

/**
 * @desc 路由动画组件
 * @author qiqiboy
 *
 *  需要动画样式文件配合，所以如果使用默认的动画效果，则需要一并将项目中的animated.css导入项目
 *  import AnimatedRouter from 'react-animated-router';
 *  import 'react-animated-router/animated.css';
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
        const classNames = prefix + '-' + (isHistoryPush(location) ? 'forward' : 'backward');

        return (
            <TransitionGroup
                className={'animated-router-container' + (className ? ' ' + className : '')}
                childFactory={child =>
                    React.cloneElement(child, {
                        classNames
                    })
                }>
                <CSSTransition
                    key={this.props.transitionKey || location.pathname}
                    addEndListener={(node, done) => {
                        node.addEventListener(
                            'transitionend',
                            function(e) {
                                console.log(e);
                                //确保动画来自于目标节点
                                if (e.target === node) {
                                    done();
                                }
                            },
                            false
                        );
                    }}
                    timeout={timeout}
                    classNames={classNames}>
                    <Switch location={location}>{children}</Switch>
                </CSSTransition>
            </TransitionGroup>
        );
    }
}

export default AnimatedRouter;
