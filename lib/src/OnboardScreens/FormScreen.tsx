import { Button, Heading, Container, Stack } from "@chakra-ui/react"
import React, { useMemo } from "react"
import { Flow, Form } from ".."
import { Text } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { DividerMw, CheckboxGroupMw, CheckboxMw, FieldsetTemplateMw, Form as OSForm, FormControlLabelMw, FormControlTemplateMw, GoogleBtnMw, InputMw, NotSupportedMw, NumberInputMw, PasswordMw, RadioGroupMw, SelectMw, SliderMw, SubmitButtonWithValidationMw, SwitchMw, TextAreaMw, FacebookBtnMw } from '../GravelForm';
import { ExtraPropsMw, FixedArrayMw, FixedObjectMw, LocalRefMw, withName } from "../GravelForm/core"
import { useEffect } from "react"


const middlewares = [

    ExtraPropsMw,
    // root middlewares
    SubmitButtonWithValidationMw,
    // preprocessor
    LocalRefMw,
    // template & schemas
    FieldsetTemplateMw,
    FixedObjectMw,
    FixedArrayMw,
    FormControlTemplateMw,
    
    
    // form controls
    withName(CheckboxMw, undefined),
    FormControlLabelMw,
    withName(RadioGroupMw, 'RadioGroup'),
    withName(SliderMw, 'Slider'),
    withName(SwitchMw, 'Switch'),
    withName(TextAreaMw, 'TextArea'),
    withName(PasswordMw, 'Password'),
    withName(GoogleBtnMw, "GoogleBtn"),
    withName(FacebookBtnMw, "FacebookBtn"),

    withName(DividerMw, "divider"),
    CheckboxGroupMw,
    SelectMw,
    InputMw,
    NumberInputMw,
    // default fallback
    NotSupportedMw,
];

const extraProps = {
    properties: {
      textarea: { component: 'TextArea' },
      password: { component: 'Password' },
      date: { component: 'DatePicker' },
      time: { component: 'TimePicker' },
      rate: { component: 'Rate' },
      slider: { component: 'Slider' },
      radioGroup: { component: 'RadioGroup' },
      switch: { component: 'Switch' },
      googleBtn: {component: 'GoogleBtn'},
      facebookBtn: {component: 'FacebookBtn'},

      divider: {component: "divider"}
    }
}

const FormScreen = ({ stepId, form, flow, onNext }: { stepId: string, form: Form, flow: Flow,onNext: (data?: Record<string, any>) => void }) => {
    const [data, setData] = React.useState<Record<string, any>>();

    const onNextClicked = (submitData) => {
        onNext(submitData)
    }

    useEffect(()=> {
        if(form.dataSchema) {
            delete form.dataSchema["title"]
            delete form.dataSchema["description"]
        }

    },[form.dataSchema])



    const needsValidation = useMemo<boolean>(() => {
        const formSetting = flow.formSettings

        if(!formSetting || !formSetting[stepId]) {
            return false
        }

        if(formSetting[stepId].validate) {
            return true
        }

        return false
    }, [flow.formSettings])

    const onSkip = () => {
        onNext()
    }
    

    return (
        <>
 

            <Container maxW={'3xl'}>
                <Stack
                    as={Box}
                    textAlign={'center'}
                    spacing={{ base: 2, md: 4 }}
                    py={{ base: 2, md: 8 }}>
                    <Heading
                        fontWeight={600}
                        fontSize={{ base: '2xl', sm: '2xl', md: '4xl' }}
                        lineHeight={'110%'}>
                        
                        <Text as={'span'} color={flow.color}>
                            {form.name}
                        </Text>
                    </Heading>

                    <OSForm
                        extraProps={extraProps}

                        schema={form.dataSchema}
                        data={data}
                        onChange={(e) => {
                            const data = e as Record<string, any>
                            setData(data)
                        }}
                        middlewares={middlewares}
                        size="md"
                        onSubmit={onNextClicked}
                    />

                    {!needsValidation && <Button onClick={onSkip}>Skip</Button>}
                </Stack>
            </Container>
        </>
    )
}

export default FormScreen