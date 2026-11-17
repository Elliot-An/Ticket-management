# Dev Agent Improvement Log

## 1. Initial Version — v1

### Existing behavior

Dev Agent v1 defined five phases:

INTAKE → PLAN → BUILD → VERIFY → REPORT

It included basic constraints:

- Do not build when handoff has not passed.
- Do not change locked scope.
- Do not change confirmed decisions.
- Do not add frameworks outside the approved tech stack.
- Do not skip verification.

### Identified GAP

The prompt contained the rule:

"Không build khi handoff chưa pass."

However, it did not explicitly define:

- What constitutes a valid handoff.
- How to evaluate handoff completeness.
- How to determine READY or NOT_READY.
- What actions to take when information is missing.
- Whether the Agent must stop before BUILD.

As a result, the readiness rule was not sufficiently enforceable.

---

## 2. Improvement Design

The following mechanisms were introduced:

| Improvement | Expected behavior |
|---|---|
| 8-item Readiness Checklist | Evaluate every mandatory handoff field. |
| PASS / FAIL / CONFLICT | Classify each checklist item. |
| READY | Allow transition to PLAN. |
| NOT_READY | Stop and report missing information. |
| NEEDS_REMAP | Stop and report conflicting information. |
| Readiness Report | Provide evidence for the readiness decision. |
| Phase transition conditions | Prevent unauthorized phase transitions. |

---

## 3. Improved Version — v2

Dev Agent v2 introduced an explicit Readiness Gate.

The Agent must verify:

1. Feature name.
2. Locked Scope.
3. Acceptance Criteria.
4. Tech stack.
5. Data model / API.
6. Output files.
7. Run command.
8. Verify command.

The Agent can only proceed to PLAN when all eight criteria pass.

---

## 4. Validation Results

| Test case | Expected behavior | Assumed result |
|---|---|---|
| All 8 criteria are complete | READY | PASS |
| One or more criteria are missing | NOT_READY and STOP | PASS |
| Documents contain conflicting decisions | NEEDS_REMAP and STOP | PASS |
| Handoff is READY | Proceed to PLAN | PASS |
| BUILD is completed | Execute VERIFY | PASS |
| Verification fails | Report FAIL, not PASS | PASS |

Note: These results represent the assumed workshop test outcome and should be replaced with actual execution evidence when available.

---

## 5. Final Conclusion

Dev Agent v2 improves the reliability of the workflow by introducing an explicit readiness evaluation and enforcement mechanism.

The main improvement is not simply adding more instructions, but defining:

- What must be checked.
- How each item is evaluated.
- What conditions allow the Agent to proceed.
- What the Agent must do when conditions are not satisfied.

This demonstrates the Explore → Design → Run improvement cycle.