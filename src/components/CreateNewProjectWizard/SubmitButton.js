// @flow
import React from 'react';
import styled from 'styled-components';
import IconBase from 'react-icons-kit';
import { check } from 'react-icons-kit/feather/check';
import { chevronRight } from 'react-icons-kit/feather/chevronRight';

import { COLORS } from '../../constants';

import Button from '../Button';
import Spinner from '../Spinner';

type Props = {
  readyToBeSubmitted: boolean,
  hasBeenSubmitted: boolean,
  isDisabled: boolean,
  onSubmit: () => void,
};

const SubmitButton = ({
  readyToBeSubmitted,
  hasBeenSubmitted,
  isDisabled,
  onSubmit,
}: Props) => {
  const buttonText = hasBeenSubmitted
    ? 'Building...'
    : readyToBeSubmitted
      ? "Let's do this"
      : 'Next';

  return (
    <Button
      disabled={isDisabled || hasBeenSubmitted}
      type="fill"
      size="large"
      color1={readyToBeSubmitted ? COLORS.green[700] : COLORS.orange[700]}
      color2={readyToBeSubmitted ? COLORS.lightGreen[500] : COLORS.orange[500]}
      style={{ color: COLORS.pink[500], width: 200 }}
      onClick={onSubmit}
    >
      <ChildWrapper>{buttonText}</ChildWrapper>

      <SubmitButtonIconWrapper>
        {hasBeenSubmitted ? (
          <Spinner size={24} />
        ) : (
          <IconBase
            size={24}
            icon={readyToBeSubmitted ? check : chevronRight}
          />
        )}
      </SubmitButtonIconWrapper>
    </Button>
  );
};

const SubmitButtonIconWrapper = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  right: 10px;
  top: 0;
  bottom: 0;
  margin: auto;
`;

const ChildWrapper = styled.div`
  line-height: 48px;
`;

export default SubmitButton;
