import React from 'react';

export const stateToProps = mixins => proxyComponent => {
    console.log(mixins);
    return mixins.reduce((proxyComponent, Mixin) => {
        return class extends Mixin {
            componentWillReceiveProps(nextProps) {
                console.log(nextProps);
            }

            render() {
                const props = Object.assign({}, this.props, this.state);
                return React.createElement(proxyComponent, props);
            }
        };
    }, proxyComponent);
};
