import { Button, Heading, Container, Stack, Spacer, Flex } from "@chakra-ui/react"
import React from "react"
import { Flow, Form } from ".."
import { Text } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { FormSetting, onActionFunc } from "../types"

const ButtonScreen = ({ stepId, stepType, form, flow, onNext, onAction }: { stepId: string, stepType: string, form?: Form, flow: Flow, onNext: (data?: Record<string, any>) => void, onAction?: onActionFunc }) => {

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
                        {//@ts-ignore 
                        formSetting.title ?? "This Or That"}

                    </Heading>
                    <Text fontWeight={600}>
                        
                        {//@ts-ignore
                        formSetting.description ?? "This Or That"}

                    </Text>

                    <Stack
                        marginBottom={"30px"}
                        direction={'column'}
                        spacing={3}
                        align={'center'}
                        alignSelf={'center'}
                        position={'relative'}>
                        <Button
                            onClick={() => {
                                if (onAction) {
                                    onAction(stepId, stepType, {})
                                }
                            }}
                            colorScheme={'green'}
                            bg={'green.400'}
                            px={6}
                            _hover={{
                                bg: 'green.500',
                            }}>
                            {//@ts-ignore
                            formSetting.optionA ?? "Option A"}
                        </Button>
                    </Stack>
                    <Button
                        isFullWidth

                        onClick={() => onNext()}
                        colorScheme={'green'}
                        bg={'green.400'}
                        px={6}
                        _hover={{
                            bg: 'green.500',
                        }}>
                        Next
                    </Button>
                </Stack>
            </Container>
        </>
    )
}

export default ButtonScreen