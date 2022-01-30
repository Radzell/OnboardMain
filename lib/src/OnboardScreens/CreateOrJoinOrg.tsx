import { Button, ButtonGroup, Center, Container, Heading, Input, InputGroup, InputRightAddon, Stack } from "@chakra-ui/react"
import React, { useMemo } from "react"
import { Flow } from ".."
import { Box, Divider, Flex, FlexProps, Text, useColorModeValue } from '@chakra-ui/react'
import { Form as OSForm, presetMws } from '../GravelForm';

export const DividerWithText = (props: FlexProps) => {
    const { children, ...flexProps } = props
    return (
        <Flex align="center" color="gray.300" {...flexProps}>
            <Box flex="1">
                <Divider borderColor="currentcolor" />
            </Box>
            <Text as="span" px="3" color={useColorModeValue('gray.600', 'gray.400')} fontWeight="medium">
                {children}
            </Text>
            <Box flex="1">
                <Divider borderColor="currentcolor" />
            </Box>
        </Flex>
    )
}



const CreateOrJoinOrg = ({ stepId, flow, onNext }: { stepId:string, flow: Flow, onNext: (data?: Record<string, any>) => void }) => {
    const [joinLink, setJoinLink] = React.useState<string>();
    const [newOrg, setNewOrg] = React.useState<Record<string, any>>();

    const [screen, setScreen] = React.useState<"join_org" | "create_org">("create_org");

    const onCreateOrgClicked = () => {
        console.log("onCreateOrgClicked")
        onNext(newOrg)
    }

    const onJoinOrgClicked = () => {
        onNext({orgJoinLink: joinLink})
    }

    const onSkip = () => {
        onNext()
    }


    const needsValidation = useMemo<boolean>(() => {
        const formSetting = flow.formSettings
        console.log('formSetting',formSetting, stepId)

        if(!formSetting || !formSetting[stepId]) {
            return false
        }

        if(formSetting[stepId].validate) {
            return true
        }

        return false
    }, [flow.formSettings])

    return (
        <Container maxW={'3xl'}>
            <Center marginTop={"6"}>
                <ButtonGroup spacing='6' >
                    <Button onClick={() => setScreen("create_org")} variant={screen === "create_org" ? "solid" : "outlined"}>Create A Organization</Button>
                    <Button onClick={() => setScreen("join_org")} variant={screen === "join_org" ? "solid" : "outlined"}>Join A Organization</Button>
                </ButtonGroup>
            </Center>
            <Stack
                as={Box}
                textAlign={'center'}
                spacing={{ base: 8, md: 14 }}
                py={{ base: 8, md: 16 }}>
                {screen === "join_org" &&
                    <>
                        <Heading
                            fontWeight={600}
                            fontSize={{ base: '2xl', sm: '4xl', md: '2xl' }}
                            lineHeight={'110%'}>
                            <Text as={'span'} color={flow.color}>
                                Join A Organization
                            </Text>
                        </Heading>
                        <InputGroup  >

                            <Input
                                placeholder="Enter a organization code"
                                {
                                ...{
                                    readOnly: true,
                                    isReadOnly: true,
                                    value: joinLink,
                                }
                                }

                                onChange={(e) => setJoinLink(e.target.value)}
                            />
                            <InputRightAddon>
                                <Button onClick={onJoinOrgClicked}>Join</Button>
                            </InputRightAddon>
                        </InputGroup>
                    </>
                }
                {screen === "create_org" &&
                    <>
                        <Heading
                            fontWeight={600}
                            fontSize={{ base: '2xl', sm: '4xl', md: '2xl' }}
                            lineHeight={'110%'}>

                            <Text as={'span'} color={flow.color}>
                                Create A Organization
                            </Text>
                        </Heading>

                        <OSForm
                            schema={{
                                title: '',
                                description: '',
                                type: 'object',
                                required: ['organizationName'],
                                definitions: {
                                    organizationName: {
                                        type: 'string',
                                        title: 'Name',
                                    },
                                    
                                },
                                properties: {
                                    organizationName: {
                                        type: 'string',
                                        title: 'Name',
                                    }
                                }
                            }}
                            data={newOrg}
                            onChange={setNewOrg}
                            middlewares={presetMws}
                            size="md"
                            onSubmit={onCreateOrgClicked}
                        />
                    </>
                }
                {!needsValidation && <Button variant='ghost' onClick={onSkip}>Skip</Button>}
            </Stack>

        </Container>
    )
}

export default CreateOrJoinOrg