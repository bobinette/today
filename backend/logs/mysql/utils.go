package mysql

import (
	"strings"

	"github.com/bobinette/today/backend/logs"
)

func join(s, sep string, n int) string {
	a := make([]string, n)
	for i := 0; i < n; i++ {
		a[i] = s
	}
	return strings.Join(a, sep)
}

type keepOrder struct {
	uuidOrder map[string]int
	logs      []logs.Log
}

func (k *keepOrder) Len() int      { return len(k.logs) }
func (k *keepOrder) Swap(i, j int) { k.logs[i], k.logs[j] = k.logs[j], k.logs[i] }
func (k *keepOrder) Less(i, j int) bool {
	return k.uuidOrder[k.logs[i].UUID] < k.uuidOrder[k.logs[j].UUID]
}
