import { Button, Heading, Container, Stack } from "@chakra-ui/react"
import React, { useMemo } from "react"
import { Flow, Form } from ".."
import { Text } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { Form as OSForm, presetMws } from '../GravelForm';

const FormScreen = ({ stepId, form, flow, onNext }: { stepId: string, form: Form, flow: Flow,onNext: (data?: Record<string, any>) => void }) => {
    const [data, setData] = React.useState<Record<string, any>>();

    const onNextClicked = () => {
        onNext(data)
    }
    delete form.dataSchema.name

    const extraProps = {
        password: {
            props: { type: 'password' },
        }
    }

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
                    spacing={{ base: 8, md: 14 }}
                    py={{ base: 20, md: 36 }}>
                    <Heading
                        fontWeight={600}
                        fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                        lineHeight={'110%'}>
                        
                        <Text as={'span'} color={flow.color}>
                            {form.name}
                        </Text>
                    </Heading>

                    <OSForm
                        extraProps={extraProps}

                        schema={form.dataSchema}
                        data={data}
                        onChange={setData}
                        middlewares={presetMws}
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