import { Button, Heading, Container, Stack, Spacer, Flex } from "@chakra-ui/react"
import React from "react"
import { Flow, Form } from ".."
import { Text } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { Form as OSForm, presetMws } from '../GravelForm';

const FormScreen = ({ form, flow, onNext }: { form: Form, flow: Flow,onNext: (data?: Record<string, any>) => void }) => {
    const [data, setData] = React.useState<Record<string, any>>();

    const onNextClicked = () => {
        onNext(data)
    }
    delete form.dataSchema.name
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
                        schema={form.dataSchema}
                        data={data}
                        onChange={setData}
                        middlewares={presetMws}
                        size="md"
                        onSubmit={onNextClicked}
                    />
                </Stack>
            </Container>
        </>
    )
}

export default FormScreen