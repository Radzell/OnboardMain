import { Button, Heading, Container, Stack, Spacer, Flex } from "@chakra-ui/react"
import React from "react"
import { Flow } from ".."
import { Text } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { CheckIcon } from "../steps/Icons"

const EndPointScreen = ({ flow, onNext }: { flow: Flow, onNext: () => void }) => {
    return (
        <>


            <Container maxW={'3xl'}>
                <Box textAlign="center" py={10} px={6}>
                    <CheckIcon boxSize={'50px'} color={flow.color} />
                    <Heading as="h2" size="xl" mt={6} mb={2}>
                        Congrats!
                    </Heading>
                    <Text color={'gray.500'}>
                        You have completed onboarding, you can start using {flow.name}
                    </Text>
                    <Stack
                        direction={'column'}
                        spacing={3}
                        pt={16}

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
                            Launch {flow.name}
                        </Button>

                        
                    </Stack>
                </Box>
            </Container>
        </>
    )
}

export default EndPointScreen