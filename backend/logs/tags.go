package logs

import (
	"regexp"
)

var (
	tagRegex = regexp.MustCompile(`(?:\B)(\#(?:\w|\-|\:)+)\b`)
)

func ExtractTags(log Log) []string {
	matches := tagRegex.FindAllStringSubmatch(log.Content, -1)
	tags := make([]string, len(matches))
	for i, match := range matches {
		tags[i] = match[1]
	}
	return tags
}
