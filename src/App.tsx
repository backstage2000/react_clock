import React from 'react';
import './App.scss';

interface StateApp {
  clockName: string;
  hasClock: boolean;
}

interface PropsClock {
  name: string;
}

interface StateClock {
  today: Date;
}

export class Clock extends React.Component<PropsClock, StateClock> {
  state: Readonly<StateClock> = {
    today: new Date(),
  };

  private timerID: number | undefined;

  componentDidMount(): void {
    this.timerID = window.setInterval(() => this.tick(), 1000);
  }

  componentDidUpdate(
    prevProps: Readonly<PropsClock>,
    prevState: Readonly<StateClock>,
  ): void {
    if (this.state.today !== prevState.today) {
      // eslint-disable-next-line no-console
      console.log(this.state.today.toUTCString().slice(-12, -4));
    }
  }

  componentWillUnmount(): void {
    if (this.timerID !== undefined) {
      clearInterval(this.timerID);
    }
  }

  tick() {
    this.setState({
      today: new Date(),
    });
  }

  render(): React.ReactNode {
    const { today } = this.state;
    const { name } = this.props;

    return (
      <div className="Clock">
        <strong className="Clock__name">{name}</strong>

        {' time is '}

        <span className="Clock__time">
          {today.toUTCString().slice(-12, -4)}
        </span>
      </div>
    );
  }
}

export class App extends React.Component<{}, StateApp> {
  state: Readonly<StateApp> = {
    clockName: 'Clock-0',
    hasClock: true,
  };

  private handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    this.setState({ hasClock: false });
    if (this.randomNameID !== undefined) {
      clearInterval(this.randomNameID);
      this.randomNameID = undefined;
    }
  };

  private handleClick = (event: MouseEvent) => {
    event.preventDefault();

    this.getRandomName();
    this.setState({ hasClock: true });

    if (this.randomNameID === undefined) {
      this.randomNameID = window.setInterval(() => this.getRandomName(), 3300);
    }
  };

  private randomNameID: number | undefined;

  getRandomName = () => {
    const value = Date.now().toString().slice(-4);

    this.setState({
      clockName: `Clock-${value}`,
    });
  };

  componentDidMount(): void {
    document.addEventListener('contextmenu', this.handleContextMenu);
    document.addEventListener('click', this.handleClick);
    if (this.randomNameID === undefined) {
      this.randomNameID = window.setInterval(() => this.getRandomName(), 3300);
    }
  }

  componentDidUpdate(
    prevProps: Readonly<StateApp>,
    prevState: Readonly<StateApp>,
  ): void {
    const nameChanged = this.state.clockName !== prevState.clockName;

    if (nameChanged) {
      // eslint-disable-next-line no-console
      console.warn(
        `Renamed from ${prevState.clockName} to ${this.state.clockName}`,
      );
    }
  }

  componentWillUnmount(): void {
    document.removeEventListener('contextmenu', this.handleContextMenu);
    document.removeEventListener('click', this.handleClick);
  }

  render(): React.ReactNode {
    const { hasClock } = this.state;

    return (
      <>
        <div className="App">
          <h1>React clock</h1>
          {hasClock && <Clock name={this.state.clockName} />}
        </div>
      </>
    );
  }
}
