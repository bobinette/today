package logs

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestExtractTags(t *testing.T) {
	log := Log{
		Content: `
This is some content with a #tag, this is not a#notatag

It parse multiple #lines, and event handles #tag_underscore, #tag-hyphen,
#tag:colon, #tag:colon:colon-hyphen_underscore
`,
	}

	expected := []string{
		"#tag",
		"#lines",
		"#tag_underscore",
		"#tag-hyphen",
		"#tag:colon",
		"#tag:colon:colon-hyphen_underscore",
	}
	actual := ExtractTags(log)
	assert.Equal(t, expected, actual)
}
