# Event sourcing

Based on https://github.com/looplab/eventhorizon/

## How to add a new event

1. Add the command in `commands.go`. Don't forget to register it in the `init` function at the top of the file
2. Add the event in `events.go`
3. Update the aggregate in `aggregate.go`: handle your new command and event in `HandleCommand` and `ApplyEvent` respectfully
4. Handle the event in `projector.go` and register the projector to it in `register.go`

