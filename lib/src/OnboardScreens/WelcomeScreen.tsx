import { Button, Heading, Container, Stack, Spacer, Flex } from "@chakra-ui/react"
import React from "react"
import { Flow } from ".."
import { Text } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'

const WelcomeScreen = ({ flow, onNext }: { flow: Flow,onNext: () => void }) => {
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
                        Welcome To <br />
                        <Text as={'span'} color={flow.color}>
                            {flow.name}
                        </Text>
                    </Heading>
                    <Text fontWeight={600}>
                        {flow.tagLine}
                    </Text>
                    <Text color={'gray.500'}>
                        Lets get you set up
                    </Text>
                    <Stack
                        direction={'column'}
                        spacing={3}
                        align={'center'}
                        alignSelf={'center'}
                        position={'relative'}>
                        <Button
                            onClick={() => onNext()}
                            colorScheme={'green'}
                            bg={'green.400'}
                            px={6}
                            _hover={{
                                bg: 'green.500',
                            }}>
                            Get Started
                        </Button>

                        
                    </Stack>
                </Stack>
            </Container>
        </>
    )
}

export default WelcomeScreen