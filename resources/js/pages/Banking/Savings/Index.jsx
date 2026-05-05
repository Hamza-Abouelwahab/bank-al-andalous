import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Coins,
    FastForward,
    Pause,
    Play,
    Target,
    Trash2,
    Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

export default function Index() {
    const {
        goals = [],
        autoSaving = {},
        errors = {},
        flash = {},
        groups = [],
        availableGroups = [],
    } = usePage().props;

    const [modal, setModal] = useState(null);
    const [selectedSavingType, setSelectedSavingType] = useState(null);
    const [challengeGoal, setChallengeGoal] = useState(null);
    const [showMessage, setShowMessage] = useState(true);
    const [joinGroupModal, setJoinGroupModal] = useState(false);

    useEffect(() => {
        if (flash.success || flash.error || Object.keys(errors).length > 0) {
            setShowMessage(true);
            const timer = setTimeout(() => setShowMessage(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash.success, flash.error, errors]);

    function openChooseType() {
        setSelectedSavingType(null);
        setModal('choose-type');
    }

    function handleTypeSelect(type) {
        if (type === 'group_saving') {
            setModal('group');
        } else {
            setSelectedSavingType(type);
            setModal('goal');
        }
    }

    function closeGoalModal() {
        setModal(null);
        setSelectedSavingType(null);
    }

    const visibleGoals = goals.filter((g) => g.saving_type !== 'group_saving');

    return (
        <>
            <Head title="Savings" />
            <div className="min-h-screen bg-[#F8F6F1] p-8">
                {showMessage && errors.balance && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                        {errors.balance}
                    </div>
                )}
                {showMessage && errors.goal && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                        {errors.goal}
                    </div>
                )}
                {showMessage && errors.account && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                        {errors.account}
                    </div>
                )}
                {showMessage && flash.success && (
                    <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                        {flash.success}
                    </div>
                )}

                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-orange-500 p-4 text-white">
                            <Target />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Savings Center
                            </h1>
                            <p className="text-slate-500">
                                Manage goals, challenges, and auto saving
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={openChooseType}
                            className="rounded-xl bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600"
                        >
                            + New Goal
                        </button>
                        <button
                            onClick={() => setJoinGroupModal(true)}
                            className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700"
                        >
                            Join Group Saving
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <section className="space-y-6 lg:col-span-2">
                        <div className="rounded-2xl border bg-white p-6 shadow-sm">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-xl font-bold">
                                    Saving Goals
                                </h2>
                                <button
                                    onClick={openChooseType}
                                    className="text-sm font-semibold text-orange-600"
                                >
                                    Create Goal
                                </button>
                            </div>

                            <div className="space-y-4">
                                {visibleGoals.length ? (
                                    visibleGoals.map((goal) => {
                                        const target = Number(
                                            goal.target_amount ?? 0,
                                        );
                                        const saved = Number(
                                            goal.saved_amount ?? 0,
                                        );
                                        const progress =
                                            target > 0
                                                ? Math.min(
                                                      (saved / target) * 100,
                                                      100,
                                                  )
                                                : 0;
                                        const today = new Date();
                                        const end = goal.end_date
                                            ? new Date(goal.end_date)
                                            : null;
                                        const daysLeft = end
                                            ? Math.max(
                                                  Math.ceil(
                                                      (end - today) /
                                                          (1000 * 60 * 60 * 24),
                                                  ),
                                                  0,
                                              )
                                            : 0;
                                        const dailyAmount =
                                            daysLeft > 0
                                                ? (
                                                      (target - saved) /
                                                      daysLeft
                                                  ).toFixed(0)
                                                : 0;
                                        const goalMessage =
                                            progress >= 100
                                                ? {
                                                      text: 'Goal completed 🎉',
                                                      className:
                                                          'bg-green-50 text-green-700 border-green-200',
                                                  }
                                                : progress >= 80
                                                  ? {
                                                        text: 'Almost there! You are close to your goal 🔥',
                                                        className:
                                                            'bg-yellow-50 text-yellow-700 border-yellow-200',
                                                    }
                                                  : null;
                                        const progressColor =
                                            progress >= 100
                                                ? 'bg-green-500'
                                                : progress >= 80
                                                  ? 'bg-yellow-500'
                                                  : 'bg-orange-500';

                                        const typeBadge =
                                            goal.saving_type === 'challenge'
                                                ? '🏆 Challenge'
                                                : goal.saving_type ===
                                                    'smart_suggestion'
                                                  ? '🧠 Smart'
                                                  : '⚡ Auto Saving';

                                        return (
                                            <div
                                                key={goal.id}
                                                className="rounded-2xl border bg-white p-5 shadow-sm"
                                            >
                                                <span className="mt-1 inline-block rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                                                    {typeBadge}
                                                </span>

                                                <div className="mb-3 flex items-center justify-between px-3 py-1">
                                                    <h3 className="font-bold text-slate-900">
                                                        {goal.name}
                                                    </h3>

                                                    <div className="flex items-center gap-2">
                                                        {goal.saving_type ===
                                                            'auto_saving' && (
                                                            <button
                                                                type="button"
                                                                title="Simulate daily saving"
                                                                onClick={() =>
                                                                    router.post(
                                                                        `/saving-goals/${goal.id}/run-auto-saving`,
                                                                    )
                                                                }
                                                                disabled={
                                                                    goal.status !==
                                                                    'active'
                                                                }
                                                                className="rounded-lg bg-orange-100 p-3 text-orange-600 hover:bg-orange-200 disabled:opacity-40"
                                                            >
                                                                <FastForward
                                                                    size={16}
                                                                />
                                                            </button>
                                                        )}

                                                        {goal.saving_type ===
                                                            'challenge' && (
                                                            <button
                                                                type="button"
                                                                title="Add challenge progress"
                                                                onClick={() =>
                                                                    setChallengeGoal(
                                                                        goal,
                                                                    )
                                                                }
                                                                disabled={
                                                                    goal.status !==
                                                                    'active'
                                                                }
                                                                className="rounded-lg bg-purple-100 p-3 text-purple-600 hover:bg-purple-200 disabled:opacity-40"
                                                            >
                                                                <Coins
                                                                    size={16}
                                                                />
                                                            </button>
                                                        )}

                                                        {goal.status ===
                                                            'active' && (
                                                            <button
                                                                type="button"
                                                                title="Get smart suggestion"
                                                                onClick={() =>
                                                                    router.post(
                                                                        `/saving-goals/${goal.id}/smart-suggestion`,
                                                                    )
                                                                }
                                                                disabled={
                                                                    goal.status !==
                                                                    'active'
                                                                }
                                                                className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200 disabled:opacity-40"
                                                            >
                                                                🧠
                                                            </button>
                                                        )}

                                                        <button
                                                            type="button"
                                                            title={
                                                                goal.status ===
                                                                'paused'
                                                                    ? 'Resume goal'
                                                                    : 'Pause goal'
                                                            }
                                                            onClick={() =>
                                                                goal.status ===
                                                                'paused'
                                                                    ? router.post(
                                                                          `/saving-goals/${goal.id}/resume`,
                                                                      )
                                                                    : router.post(
                                                                          `/saving-goals/${goal.id}/pause`,
                                                                      )
                                                            }
                                                            className={`rounded-lg p-3 text-xs font-semibold ${
                                                                goal.status ===
                                                                'paused'
                                                                    ? 'bg-gray-200 text-gray-600'
                                                                    : 'bg-green-100 text-green-700'
                                                            }`}
                                                        >
                                                            {goal.status ===
                                                            'paused' ? (
                                                                <Play
                                                                    size={16}
                                                                />
                                                            ) : (
                                                                <Pause
                                                                    size={16}
                                                                />
                                                            )}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            title="Delete goal"
                                                            onClick={() => {
                                                                if (
                                                                    confirm(
                                                                        'Are you sure you want to delete this goal?',
                                                                    )
                                                                ) {
                                                                    router.delete(
                                                                        `/saving-goals/${goal.id}`,
                                                                    );
                                                                }
                                                            }}
                                                            className="rounded-lg bg-red-100 p-3 text-red-600 hover:bg-red-200"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mb-3 h-3 rounded-full bg-gray-100">
                                                    <div
                                                        className={`h-3 rounded-full ${progressColor}`}
                                                        style={{
                                                            width: `${progress}%`,
                                                        }}
                                                    />
                                                </div>

                                                {goalMessage && (
                                                    <div
                                                        className={`mb-3 rounded-xl border p-3 text-sm font-medium ${goalMessage.className}`}
                                                    >
                                                        {goalMessage.text}
                                                    </div>
                                                )}

                                                <div className="mb-4 flex justify-between text-sm text-slate-500">
                                                    <span>
                                                        {saved.toFixed(2)} MAD
                                                    </span>
                                                    <span>
                                                        of {target.toFixed(2)}{' '}
                                                        MAD
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="rounded-xl border border-orange-200 bg-orange-50 p-3">
                                                        <p className="text-xs text-orange-600">
                                                            Daily Amount
                                                        </p>
                                                        <p className="font-bold text-orange-700">
                                                            {dailyAmount} MAD
                                                        </p>
                                                    </div>
                                                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                                                        <p className="text-xs text-blue-600">
                                                            Days Left
                                                        </p>
                                                        <p className="font-bold text-blue-700">
                                                            {daysLeft}
                                                        </p>
                                                    </div>
                                                    <div className="rounded-xl border border-green-200 bg-green-50 p-3">
                                                        <p className="text-xs text-green-600">
                                                            Status
                                                        </p>
                                                        <p className="font-bold text-green-700">
                                                            {progress >= 100
                                                                ? 'Completed'
                                                                : goal.status ===
                                                                    'paused'
                                                                  ? 'Paused'
                                                                  : 'Active'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        No saving goals yet.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-6">
                        <div className="rounded-2xl border bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                                    <Zap />
                                </div>
                                <h2 className="text-xl font-bold">
                                    Silent Auto Saving
                                </h2>
                            </div>
                            <p className="text-sm text-slate-500">
                                {autoSaving.rule ??
                                    'Auto-save from transactions'}
                            </p>
                            <div className="mt-5 rounded-xl bg-orange-50 p-4">
                                <p className="text-sm text-orange-700">
                                    Saved this month
                                </p>
                                <p className="mt-1 text-2xl font-bold text-orange-600">
                                    {autoSaving.saved_month ?? 0} MAD
                                </p>
                            </div>
                            <button className="mt-5 w-full rounded-xl bg-slate-900 py-3 font-bold text-white">
                                Setup Auto Saving
                            </button>
                        </div>
                    </aside>
                </div>

                <GroupsSection
                    groups={groups}
                    onCreateGroup={() => setModal('group')}
                />
            </div>

            {modal === 'choose-type' && (
                <ChooseSavingTypeModal
                    onClose={() => setModal(null)}
                    onSelect={handleTypeSelect}
                />
            )}

            {modal === 'goal' && (
                <CreateGoalModal
                    savingType={selectedSavingType}
                    onClose={closeGoalModal}
                />
            )}

            {modal === 'group' && (
                <CreateGroupModal onClose={() => setModal(null)} />
            )}

            {challengeGoal && (
                <AddProgressModal
                    goal={challengeGoal}
                    onClose={() => setChallengeGoal(null)}
                />
            )}

            {joinGroupModal && (
                <JoinGroupModal
                    groups={availableGroups}
                    onClose={() => setJoinGroupModal(false)}
                />
            )}
        </>
    );
}

function ChooseSavingTypeModal({ onClose, onSelect }) {
    const types = [
        {
            key: 'auto_saving',
            emoji: '⚡',
            label: 'Auto Saving',
            desc: 'Automatically save a fixed amount daily toward your goal.',
            color: 'border-orange-200 hover:bg-orange-50',
            badge: 'bg-orange-100 text-orange-700',
        },
        {
            key: 'challenge',
            emoji: '🏆',
            label: 'Saving Challenge',
            desc: 'Manually add progress to challenge yourself to save more.',
            color: 'border-purple-200 hover:bg-purple-50',
            badge: 'bg-purple-100 text-purple-700',
        },
        {
            key: 'smart_suggestion',
            emoji: '🧠',
            label: 'Smart Saving',
            desc: 'Get AI-powered suggestions based on your spending habits.',
            color: 'border-blue-200 hover:bg-blue-50',
            badge: 'bg-blue-100 text-blue-700',
        },
        {
            key: 'group_saving',
            emoji: '👥',
            label: 'Group Saving',
            desc: 'Save together with friends or family in a shared group.',
            color: 'border-indigo-200 hover:bg-indigo-50',
            badge: 'bg-indigo-100 text-indigo-700',
        },
    ];

    return (
        <Modal title="Choose Saving Type" onClose={onClose}>
            <div className="grid grid-cols-2 gap-3">
                {types.map((t) => (
                    <button
                        key={t.key}
                        type="button"
                        onClick={() => onSelect(t.key)}
                        className={`rounded-2xl border p-4 text-left transition ${t.color}`}
                    >
                        <span
                            className={`mb-2 inline-block rounded-full px-2 py-1 text-xs font-semibold ${t.badge}`}
                        >
                            {t.emoji} {t.label}
                        </span>
                        <p className="text-xs text-slate-500">{t.desc}</p>
                    </button>
                ))}
            </div>
        </Modal>
    );
}

function CreateGoalModal({ savingType, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        target_amount: '',
        end_date: '',
        saving_type: savingType ?? 'auto_saving',
    });

    function submit(e) {
        e.preventDefault();
        post('/saving-goals', { onSuccess: onClose });
    }

    const targetAmount = Number(data.target_amount || 0);
    const today = new Date();
    const endDate = data.end_date ? new Date(data.end_date) : null;
    const daysLeft = endDate
        ? Math.max(Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)), 0)
        : 0;
    const estimatedDailyAmount =
        targetAmount > 0 && daysLeft > 0
            ? (targetAmount / daysLeft).toFixed(2)
            : null;

    const typeBadge = {
        auto_saving: {
            label: '⚡ Auto Saving',
            className: 'bg-orange-50 text-orange-700',
        },
        challenge: {
            label: '🏆 Saving Challenge',
            className: 'bg-purple-50 text-purple-700',
        },
        smart_suggestion: {
            label: '🧠 Smart Saving',
            className: 'bg-blue-50 text-blue-700',
        },
    }[data.saving_type];

    return (
        <Modal title="Create Saving Goal" onClose={onClose}>
            {typeBadge && (
                <span
                    className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold ${typeBadge.className}`}
                >
                    {typeBadge.label}
                </span>
            )}
            <form onSubmit={submit} className="space-y-4">
                <Input
                    label="Goal Name"
                    value={data.name}
                    onChange={(v) => setData('name', v)}
                    error={errors.name}
                    placeholder="Buy a car"
                />
                <Input
                    label="Target Amount"
                    type="number"
                    value={data.target_amount}
                    onChange={(v) => setData('target_amount', v)}
                    error={errors.target_amount}
                    placeholder="10000"
                />
                <Input
                    label="Deadline"
                    type="date"
                    value={data.end_date}
                    onChange={(v) => setData('end_date', v)}
                    error={errors.end_date}
                />
                {estimatedDailyAmount && (
                    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                        <p className="text-sm font-medium text-orange-700">
                            Estimated daily saving
                        </p>
                        <p className="mt-1 text-2xl font-bold text-orange-600">
                            {estimatedDailyAmount} MAD / day
                        </p>
                        <p className="mt-1 text-xs text-orange-700">
                            Based on your target amount and deadline.
                        </p>
                    </div>
                )}
                <button
                    disabled={processing}
                    className="w-full rounded-xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-60"
                >
                    {processing ? 'Creating...' : 'Create Goal'}
                </button>
            </form>
        </Modal>
    );
}

function AddProgressModal({ goal, onClose }) {
    const { data, setData, post, processing, errors } = useForm({ amount: '' });

    function submit(e) {
        e.preventDefault();
        post(`/saving-goals/${goal.id}/add-progress`, { onSuccess: onClose });
    }

    return (
        <Modal title="Add Progress" onClose={onClose}>
            <form onSubmit={submit} className="space-y-4">
                <Input
                    label="Amount"
                    placeholder="Minimum 10 MAD"
                    type="number"
                    value={data.amount}
                    onChange={(v) => setData('amount', v)}
                    error={errors.amount}
                />
                <button
                    disabled={processing}
                    className="w-full rounded-xl bg-purple-600 py-3 font-bold text-white"
                >
                    Add Progress
                </button>
            </form>
        </Modal>
    );
}

function CreateGroupModal({ onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        amount: '',
        max_members: '',
        start_date: '',
        cycle_days: '15',
    });

    function submit(e) {
        e.preventDefault();
        post('/saving-groups', { onSuccess: onClose });
    }

    return (
        <Modal title="Create Saving Group" onClose={onClose}>
            <form onSubmit={submit} className="space-y-4">
                <Input
                    label="Group Name"
                    value={data.name}
                    onChange={(v) => setData('name', v)}
                    error={errors.name}
                    placeholder="Car saving group"
                />
                <Input
                    label="Contribution Amount"
                    type="number"
                    value={data.amount}
                    onChange={(v) => setData('amount', v)}
                    error={errors.amount}
                    placeholder="100"
                />
                <Input
                    label="Max Members (2–12)"
                    type="number"
                    value={data.max_members}
                    onChange={(v) => setData('max_members', v)}
                    error={errors.max_members}
                    placeholder="4"
                    min={2}
                    max={12}
                />
                <Input
                    label="Start Date"
                    type="date"
                    value={data.start_date}
                    onChange={(v) => setData('start_date', v)}
                    error={errors.start_date}
                />
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Cycle Days
                    </label>
                    <select
                        value={data.cycle_days}
                        onChange={(e) => setData('cycle_days', e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-200 px-4 outline-none focus:border-indigo-500"
                    >
                        <option value="15">Every 15 days</option>
                        <option value="30">Every 30 days</option>
                    </select>
                    {errors.cycle_days && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.cycle_days}
                        </p>
                    )}
                </div>
                {data.amount && data.max_members && (
                    <div className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-700">
                        Total pot:{' '}
                        {Number(data.amount) * Number(data.max_members)} MAD
                        <br />
                        Minimum required: 3000 MAD
                    </div>
                )}
                <button
                    disabled={processing}
                    className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                    {processing ? 'Creating...' : 'Create Group'}
                </button>
            </form>
        </Modal>
    );
}

function GroupsSection({ groups = [], onCreateGroup }) {
    if (!groups.length) return null;

    const statusBadge = {
        waiting: {
            label: '⏳ Waiting',
            className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        },
        active: {
            label: '✅ Active',
            className: 'bg-green-50 text-green-700 border-green-200',
        },
        completed: {
            label: '🏁 Completed',
            className: 'bg-slate-50 text-slate-600 border-slate-200',
        },
        cancelled: {
            label: '❌ Cancelled',
            className: 'bg-red-50 text-red-600 border-red-200',
        },
    };

    return (
        <div className="mt-8">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                    👥 Group Savings
                </h2>
                <button
                    onClick={onCreateGroup}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                >
                    + New Group
                </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {groups.map((group) => {
                    const badge =
                        statusBadge[group.status] ?? statusBadge.waiting;
                    return (
                        <div
                            key={group.id}
                            className="rounded-2xl border bg-white p-5 shadow-sm"
                        >
                            {/* Header */}
                            <div className="mb-3 flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        {group.name}
                                    </h3>
                                    <p className="mt-0.5 text-xs text-slate-400">
                                        Every {group.cycle_days} days
                                    </p>
                                </div>
                                <span
                                    className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${badge.className}`}
                                >
                                    {badge.label}
                                </span>
                            </div>

                            {/* Cancelled alert */}
                            {group.status === 'cancelled' && (
                                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                    ⚠️ Group cancelled because not enough
                                    members joined before the start date.
                                </div>
                            )}

                            {/* Stats grid */}
                            <div className="mb-4 grid grid-cols-2 gap-2">
                                <div className="rounded-xl bg-indigo-50 p-3">
                                    <p className="text-xs text-indigo-500">
                                        Contribution
                                    </p>
                                    <p className="font-bold text-indigo-700">
                                        {group.amount} MAD
                                    </p>
                                </div>
                                <div className="rounded-xl bg-orange-50 p-3">
                                    <p className="text-xs text-orange-500">
                                        Total Pot
                                    </p>
                                    <p className="font-bold text-orange-700">
                                        {group.total_pot} MAD
                                    </p>
                                </div>
                                <div className="rounded-xl bg-slate-50 p-3">
                                    <p className="text-xs text-slate-500">
                                        Members
                                    </p>
                                    <p className="font-bold text-slate-700">
                                        {group.current_members}/
                                        {group.max_members}
                                    </p>
                                </div>
                                <div className="rounded-xl bg-blue-50 p-3">
                                    <p className="text-xs text-blue-500">
                                        Start Date
                                    </p>
                                    <p className="text-xs font-bold text-blue-700">
                                        {group.start_date ?? '—'}
                                    </p>
                                </div>
                                <div className="col-span-2 rounded-xl bg-purple-50 p-3">
                                    <p className="text-xs text-purple-500">
                                        Next Draw
                                    </p>
                                    <p className="text-xs font-bold text-purple-700">
                                        {group.next_draw_date ??
                                            'Waiting to fill'}
                                    </p>
                                </div>
                            </div>

                            {/* Bank guarantee info */}
                            {group.bank_sponsored && (
                                <div className="mb-4 space-y-1 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm">
                                    <p className="font-semibold text-blue-800">
                                        🏦 Bank Guarantee: Active
                                    </p>
                                    <p className="text-blue-700">
                                        Bank Fee: {group.bank_fee_percent}% (
                                        {group.bank_fee} MAD)
                                    </p>
                                    <p className="text-blue-700">
                                        Winner receives:{' '}
                                        <span className="font-bold">
                                            {group.winner_amount} MAD
                                        </span>
                                    </p>
                                </div>
                            )}

                            {/* Rotation / Turn Info */}
                            {group.status === 'active' &&
                                group.current_receiver_name && (
                                    <div className="mb-4 space-y-1 rounded-xl border border-green-200 bg-green-50 p-3 text-sm">
                                        <p className="font-semibold text-green-800">
                                            🎯 Current Turn
                                        </p>
                                        <p className="text-green-700">
                                            Next receiver:{' '}
                                            <span className="font-bold">
                                                {group.current_receiver_name}
                                            </span>
                                        </p>
                                        {group.draw_start_date && (
                                            <p className="text-green-700">
                                                Draw started:{' '}
                                                {group.draw_start_date}
                                            </p>
                                        )}
                                        {group.draw_end_date && (
                                            <p className="text-green-700">
                                                Draw ends: {group.draw_end_date}
                                            </p>
                                        )}
                                        {group.days_remaining !== null && (
                                            <p className="text-green-700">
                                                Days remaining:{' '}
                                                <span className="font-bold">
                                                    {group.days_remaining}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                )}

                            {group.status === 'active' &&
                                !group.current_receiver_name && (
                                    <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                                        ⏳ Waiting for draw to start
                                    </div>
                                )}

                            {group.status === 'completed' && (
                                <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                                    ✅ All members have received their turn.
                                </div>
                            )}

                            {/* Current winner */}
                            {group.current_winner && (
                                <div className="mb-3 rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm">
                                    🏆{' '}
                                    <span className="font-semibold text-yellow-800">
                                        Current winner:
                                    </span>{' '}
                                    <span className="text-yellow-700">
                                        {group.current_winner.name}
                                    </span>
                                </div>
                            )}

                            {/* Members list */}
                            <div>
                                <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                                    Members
                                </p>
                                {group.members?.length ? (
                                    <ul className="space-y-1">
                                        {group.members.map((m) => (
                                            <li
                                                key={m.id}
                                                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-sm"
                                            >
                                                <span className="text-slate-700">
                                                    {m.name}
                                                </span>
                                                {m.has_won && (
                                                    <span title="Has won a draw">
                                                        🏆
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-slate-400">
                                        No members yet.
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function JoinGroupModal({ groups = [], onClose }) {
    return (
        <Modal title="Join Group Saving" onClose={onClose}>
            <div className="space-y-4">
                {groups.length ? (
                    groups.map((group) => {
                        const isMember = group.is_member === true;
                        return (
                            <div
                                key={group.id}
                                className="rounded-2xl border bg-white p-4 shadow-sm"
                            >
                                <div className="mb-3 flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            {group.name}
                                        </h3>
                                        <p className="mt-0.5 text-xs text-slate-400">
                                            Every {group.cycle_days} days
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!isMember) {
                                                router.post(
                                                    `/saving-groups/${group.id}/join`,
                                                    {},
                                                    { onSuccess: onClose },
                                                );
                                            }
                                        }}
                                        disabled={isMember}
                                        className={`rounded-xl px-4 py-2 text-sm font-bold ${
                                            isMember
                                                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                    >
                                        {isMember ? 'Already joined' : 'Join'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="rounded-xl bg-indigo-50 p-2">
                                        <p className="text-xs text-indigo-500">
                                            Contribution
                                        </p>
                                        <p className="text-sm font-bold text-indigo-700">
                                            {group.amount} MAD
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-orange-50 p-2">
                                        <p className="text-xs text-orange-500">
                                            Total Pot
                                        </p>
                                        <p className="text-sm font-bold text-orange-700">
                                            {group.total_pot} MAD
                                        </p>
                                    </div>
                                    <div className="rounded-xl bg-slate-50 p-2">
                                        <p className="text-xs text-slate-500">
                                            Members
                                        </p>
                                        <p className="text-sm font-bold text-slate-700">
                                            {group.current_members}/
                                            {group.max_members}
                                        </p>
                                    </div>
                                </div>

                                {group.start_date && (
                                    <p className="mt-2 text-xs text-slate-400">
                                        Start date: {group.start_date}
                                    </p>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p className="rounded-xl bg-gray-50 p-4 text-sm text-slate-500">
                        No available groups to join right now.
                    </p>
                )}
            </div>
        </Modal>
    );
}

function Modal({ title, onClose, children }) {
    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            >
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-2xl text-slate-400 hover:text-slate-700"
                    >
                        ×
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function Input({
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder = '',
    min,
    max,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                min={min}
                max={max}
                onChange={(e) => onChange(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 px-4 outline-none focus:border-orange-500"
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
