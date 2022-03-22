import { Button, Heading, Container, Stack, Spacer, Flex } from "@chakra-ui/react"
import React from "react"
import { Flow, Form } from ".."
import { Text } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

const ThisOrThatScreen = ({ stepId, form, flow, onNext }: { stepId: string, form: Form, flow: Flow, onNext: (data?: Record<string, any>) => void }) => {

    const formSetting = flow?.formSettings ? flow?.formSettings[stepId] ?? {} : {}

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
                        {formSetting.title ?? "This Or That"}

                    </Heading>
                    <Text fontWeight={600}>
                        {formSetting.description ?? "This Or That"}

                    </Text>

                    <Stack
                        direction={'row'}
                        spacing={3}
                        align={'center'}
                        alignSelf={'center'}
                        position={'relative'}>
                        <Button
                            onClick={() => onNext({ option: "option_a" })}
                            colorScheme={'green'}
                            bg={'green.400'}
                            px={6}
                            _hover={{
                                bg: 'green.500',
                            }}>
                            {formSetting.optionA ?? "Option A"}
                        </Button>

                        {formSetting.optionB && <Button
                            onClick={() => onNext({ option: "option_b" })}
                            colorScheme={'green'}
                            bg={'green.400'}
                            px={6}
                            _hover={{
                                bg: 'green.500',
                            }}>
                            {formSetting.optionB ?? "Option B"}
                        </Button>}




                    </Stack>
                </Stack>
            </Container>
        </>
    )
}

export default ThisOrThatScreen