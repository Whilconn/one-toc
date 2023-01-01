import React, { ReactElement } from 'react';
import pkg from '../../package.json';
import './error-boundary.less';

interface Props {
  children: ReactElement;
  className?: string;
}

interface State {
  error: Error | undefined;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error) {
    return { error: error };
  }

  render() {
    const className = this.props.className || '';
    if (this.state.error) {
      return (
        <div className={`error-boundary ${className}`}>
          <p>{pkg.extName}插件出现错误</p>
          <p className="grey">错误信息：{this.state.error.message}</p>
          <p>
            <a onClick={() => location.reload()}>刷新页面</a>试试，或者联系
            <a href={pkg.homepage} target="_blank" rel="noreferrer">
              作者
            </a>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
