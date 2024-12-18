import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button, InputGroup, LabelWithStep, SubHeaderWithIcon } from '@/components/view'
import { useValidateId } from '@/queries'
import { useStepsActions, useTotalStep } from '@/stores'
import type { StepProps } from '@/types'

export const SignupOneStep = ({ label }: StepProps) => {
  const navigate = useNavigate()
  const totalStep = useTotalStep()

  const [validationSuccessMessage, setValidationSuccessMessage] = useState<string | null>(null)
  const [validationErrorMessage, setValidationErrorMessage] = useState<string | null>(null)
  const [isIdValidated, setIsIdValidated] = useState(false)

  const { goNextStep } = useStepsActions()
  const { mutate: validateIdMutation } = useValidateId()
  const { getValues, trigger, reset, watch } = useFormContext()

  const watchUserIdField = watch('userId')

  const handleClickCloseButton = () => {
    navigate('/login')
    reset()
  }

  const handleClickNextButton = async () => {
    const isValid = await trigger(['userId', 'password', 'confirm'])
    if (isValid) goNextStep()
  }

  const handleClickValidateId = async () => {
    const isValid = await trigger(['userId'])
    if (isValid) {
      const userId = getValues('userId')
      validateIdMutation(
        { body: { userId: userId } },
        {
          onSuccess: () => {
            setValidationSuccessMessage('사용 가능한 아이디입니다')
            setValidationErrorMessage(null)
            setIsIdValidated(true)
          },
          onError: () => {
            setValidationSuccessMessage(null)
            setValidationErrorMessage('이미 사용 중인 아이디입니다')
            setIsIdValidated(false)
          },
        },
      )
    }
  }

  useEffect(() => {
    setIsIdValidated(false)
    setValidationSuccessMessage(null)
    setValidationErrorMessage(null)
  }, [watchUserIdField])

  return (
    <>
      <SubHeaderWithIcon
        type="close"
        onClickCancle={handleClickCloseButton}
        onClickClose={handleClickCloseButton}
      />

      <LabelWithStep currentStep={1} totalStep={totalStep}>
        {label}
      </LabelWithStep>

      <div className="flex-column scroll mx-4 mb-2 mt-[65px] grow gap-7">
        <InputGroup>
          <InputGroup.Label
            section="userId"
            customSuccessMessage={validationSuccessMessage}
            customErrorMessage={validationErrorMessage}
          >
            아이디
          </InputGroup.Label>
          <div className="flex gap-4">
            <InputGroup.Input section="userId" placeholder="최소 6글자, 최대 12글자" />
            <Button size="md" onClick={handleClickValidateId}>
              중복 확인
            </Button>
          </div>
        </InputGroup>

        <InputGroup>
          <InputGroup.Label section="password">비밀번호</InputGroup.Label>
          <InputGroup.Input
            section="password"
            type="password"
            placeholder="최소 8글자, 최대 16글자"
          />
        </InputGroup>

        <InputGroup>
          <InputGroup.Label section="confirm">비밀번호 확인</InputGroup.Label>
          <InputGroup.Input
            section="confirm"
            type="password"
            placeholder="최소 8글자, 최대 16글자"
          />
        </InputGroup>
      </div>

      <Button
        size="lg"
        onClick={handleClickNextButton}
        disabled={!isIdValidated}
        classname="mt-2 mb-10 mx-4"
      >
        다음으로
      </Button>
    </>
  )
}
