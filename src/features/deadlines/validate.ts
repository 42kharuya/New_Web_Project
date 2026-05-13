/**
 * Deadline Item 作成リクエストのバリデーション
 *
 * DB や外部依存を持たない純粋関数として切り出し、
 * ユニットテストが容易な設計にしている。
 */

const VALID_KINDS = ["es", "briefing", "interview", "other"] as const;
const VALID_STATUSES = ["todo", "submitted", "done", "canceled"] as const;

export type DeadlineKindValue = (typeof VALID_KINDS)[number];
export type DeadlineStatusValue = (typeof VALID_STATUSES)[number];

/** バリデーション済みの正規化済み入力値 */
export interface NormalizedDeadlineInput {
  companyName: string;
  kind: DeadlineKindValue;
  deadlineAt: Date;
  status: DeadlineStatusValue;
  link: string | null;
  memo: string | null;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type ValidateResult =
  | { ok: true; data: NormalizedDeadlineInput }
  | { ok: false; errors: ValidationError[] };

// ----------------------------------------------------------------
// フィールドレベルのバリデーターヘルパー（プライベート）
// ----------------------------------------------------------------

type FieldOk<T> = { ok: true; value: T };
type FieldErr = { ok: false; error: ValidationError };

function checkCompanyName(raw: unknown): FieldOk<string> | FieldErr {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value)
    return { ok: false, error: { field: "company_name", message: "企業名は必須です" } };
  if (value.length > 100)
    return { ok: false, error: { field: "company_name", message: "企業名は100文字以内で入力してください" } };
  return { ok: true, value };
}

function checkKind(raw: unknown): FieldOk<DeadlineKindValue> | FieldErr {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value)
    return { ok: false, error: { field: "kind", message: "種別は必須です" } };
  if (!(VALID_KINDS as readonly string[]).includes(value))
    return { ok: false, error: { field: "kind", message: `種別は ${VALID_KINDS.join(" / ")} のいずれかを指定してください` } };
  return { ok: true, value: value as DeadlineKindValue };
}

function checkDeadlineAt(raw: unknown): FieldOk<Date> | FieldErr {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value)
    return { ok: false, error: { field: "deadline_at", message: "締切日時は必須です" } };
  const d = new Date(value);
  if (isNaN(d.getTime()))
    return { ok: false, error: { field: "deadline_at", message: "締切日時は有効な ISO 8601 形式で入力してください" } };
  return { ok: true, value: d };
}

function checkStatus(raw: unknown): FieldOk<DeadlineStatusValue> | FieldErr {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!(VALID_STATUSES as readonly string[]).includes(value))
    return { ok: false, error: { field: "status", message: `ステータスは ${VALID_STATUSES.join(" / ")} のいずれかを指定してください` } };
  return { ok: true, value: value as DeadlineStatusValue };
}

function checkLink(raw: unknown): FieldOk<string | null> | FieldErr {
  if (raw === null || raw === "" || raw === undefined) return { ok: true, value: null };
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) return { ok: true, value: null };
  if (value.length > 2048)
    return { ok: false, error: { field: "link", message: "リンクは2048文字以内で入力してください" } };
  if (!/^https?:\/\/.+/.test(value))
    return { ok: false, error: { field: "link", message: "リンクは http:// または https:// で始まる URL を入力してください" } };
  return { ok: true, value };
}

function checkMemo(raw: unknown): FieldOk<string | null> | FieldErr {
  if (raw === null || raw === "" || raw === undefined) return { ok: true, value: null };
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) return { ok: true, value: null };
  if (value.length > 1000)
    return { ok: false, error: { field: "memo", message: "メモは1000文字以内で入力してください" } };
  return { ok: true, value };
}

// ----------------------------------------------------------------
// POST /api/deadlines バリデーション
// ----------------------------------------------------------------

/**
 * POST /api/deadlines のリクエストボディを検証して正規化する。
 *
 * ルール:
 *  - company_name: 必須、1〜100文字
 *  - kind: 必須、"es" | "briefing" | "interview" | "other"
 *  - deadline_at: 必須、ISO 8601 文字列（有効な日時）
 *  - status: 任意、デフォルト "todo"、"todo" | "submitted" | "done" | "canceled"
 *  - link: 任意、http(s) URL、最大 2048 文字
 *  - memo: 任意、最大 1000 文字
 */
export function validateCreateDeadline(body: unknown): ValidateResult {
  const errors: ValidationError[] = [];

  if (typeof body !== "object" || body === null) {
    return {
      ok: false,
      errors: [{ field: "_body", message: "リクエストボディが不正です" }],
    };
  }
  const b = body as Record<string, unknown>;

  const companyResult = checkCompanyName(b.company_name);
  if (!companyResult.ok) errors.push(companyResult.error);

  const kindResult = checkKind(b.kind);
  if (!kindResult.ok) errors.push(kindResult.error);

  const deadlineResult = checkDeadlineAt(b.deadline_at);
  if (!deadlineResult.ok) errors.push(deadlineResult.error);

  // status（任意、デフォルト "todo"）
  let status: DeadlineStatusValue = "todo";
  if (b.status !== undefined) {
    const statusResult = checkStatus(b.status);
    if (!statusResult.ok) errors.push(statusResult.error);
    else status = statusResult.value;
  }

  const linkResult = checkLink(b.link);
  if (!linkResult.ok) errors.push(linkResult.error);

  const memoResult = checkMemo(b.memo);
  if (!memoResult.ok) errors.push(memoResult.error);

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      companyName: (companyResult as FieldOk<string>).value,
      kind: (kindResult as FieldOk<DeadlineKindValue>).value,
      deadlineAt: (deadlineResult as FieldOk<Date>).value,
      status,
      link: (linkResult as FieldOk<string | null>).value,
      memo: (memoResult as FieldOk<string | null>).value,
    },
  };
}

// ----------------------------------------------------------------
// PATCH /api/deadlines/:id 用バリデーション
// ----------------------------------------------------------------

/** PATCH 時の正規化済み入力値（全フィールド optional） */
export interface NormalizedUpdateInput {
  companyName?: string;
  kind?: DeadlineKindValue;
  deadlineAt?: Date;
  status?: DeadlineStatusValue;
  link?: string | null;
  memo?: string | null;
}

export type ValidateUpdateResult =
  | { ok: true; data: NormalizedUpdateInput }
  | { ok: false; errors: ValidationError[] };

/**
 * PATCH /api/deadlines/:id のリクエストボディを検証して正規化する。
 *
 * ルール:
 *  - 少なくとも 1 フィールドが必要
 *  - company_name: 1〜100 文字（指定した場合）
 *  - kind: "es" | "briefing" | "interview" | "other"（指定した場合）
 *  - deadline_at: ISO 8601 文字列（指定した場合）
 *  - status: "todo" | "submitted" | "done" | "canceled"（指定した場合）
 *  - link: http(s) URL、最大 2048 文字（指定した場合）。null で削除可
 *  - memo: 最大 1000 文字（指定した場合）。null で削除可
 */
export function validateUpdateDeadline(body: unknown): ValidateUpdateResult {
  const errors: ValidationError[] = [];

  if (typeof body !== "object" || body === null) {
    return {
      ok: false,
      errors: [{ field: "_body", message: "リクエストボディが不正です" }],
    };
  }
  const b = body as Record<string, unknown>;

  const data: NormalizedUpdateInput = {};

  if (b.company_name !== undefined) {
    const r = checkCompanyName(b.company_name);
    if (!r.ok) errors.push(r.error);
    else data.companyName = r.value;
  }

  if (b.kind !== undefined) {
    const r = checkKind(b.kind);
    if (!r.ok) errors.push(r.error);
    else data.kind = r.value;
  }

  if (b.deadline_at !== undefined) {
    const r = checkDeadlineAt(b.deadline_at);
    if (!r.ok) errors.push(r.error);
    else data.deadlineAt = r.value;
  }

  if (b.status !== undefined) {
    const r = checkStatus(b.status);
    if (!r.ok) errors.push(r.error);
    else data.status = r.value;
  }

  if (b.link !== undefined) {
    const r = checkLink(b.link);
    if (!r.ok) errors.push(r.error);
    else data.link = r.value;
  }

  if (b.memo !== undefined) {
    const r = checkMemo(b.memo);
    if (!r.ok) errors.push(r.error);
    else data.memo = r.value;
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  if (Object.keys(data).length === 0) {
    return {
      ok: false,
      errors: [
        {
          field: "_body",
          message: "更新するフィールドを少なくとも 1 つ指定してください",
        },
      ],
    };
  }

  return { ok: true, data };
}
