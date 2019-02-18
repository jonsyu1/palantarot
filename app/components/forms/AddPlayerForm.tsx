import React from 'react';
import { TextInput } from './Elements';
import { NewPlayer } from '../../../server/model/Player';

interface Props {
  onSubmit: (newPlayer: NewPlayer) => void;
}

interface State {
  firstName: string;
  firstNameError?: string;
  lastName: string;
  lastNameError?: string;
}

export class AddPlayerForm extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      firstName: '',
      firstNameError: ' ',
      lastName: '',
      lastNameError: ' ',
    };
  }

  public render() {
    const baseButtonClass = 'add-player-score-button pt-button pt-large pt-icon-add pt-intent-success';
    const buttonClass = `${baseButtonClass} ${this.submitEnabled() ? '' : 'pt-disabled'}`;
    return (
      <div className="add-player-form">
        <TextInput
          label="First Name: "
          classNames={['pt-add-player-input']}
          onChange={this.onFirstNameChange}
          validator={this.fieldValidator('Please enter a first name.')}
        />

        <TextInput
          label="Last Name: "
          classNames={['pt-add-player-input']}
          onChange={this.onLastNameChange}
          validator={this.fieldValidator('Please enter a last name.')}
        />

        <div className="add-player-button-container">
          <button className={buttonClass} onClick={this.onClickButton}>Add Player</button>
        </div>
      </div>
    );
  }

  private onFirstNameChange = (value: string, error?: string) => {
    this.setState({
      firstName: value,
      firstNameError: error,
    });
  }

  private onLastNameChange = (value: string, error?: string) => {
    this.setState({
      lastName: value,
      lastNameError: error,
    });
  }

  private fieldValidator = (emptyMessage: string) => {
    return (value: string) => {
      if (value.length < 1) {
        return emptyMessage;
      } else if (value.length > 30) {
        return "Field exceeds character limit.";
      } else {
        return undefined;
      }
    };
  }
  
  private submitEnabled = () => {
    return !this.state.firstNameError && !this.state.lastNameError;
  }

  private onClickButton = () => {
    if (this.submitEnabled()) {
      this.props.onSubmit(this.state);
    }
  }
}
