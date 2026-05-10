import { Head, useForm, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    Check,
    ChevronLeft,
    ChevronRight,
    Coins,
    Copy,
    FastForward,
    Lightbulb,
    Pause,
    Play,
    Target,
    Trash2,
    X,
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
        pendingInvitations = [],
    } = usePage().props;

    const [modal, setModal] = useState(null);
    const [selectedSavingType, setSelectedSavingType] = useState(null);
    const [challengeGoal, setChallengeGoal] = useState(null);
    const [showMessage, setShowMessage] = useState(true);
    const [joinGroupModal, setJoinGroupModal] = useState(false);
    const [showSavingTypeModal, setShowSavingTypeModal] = useState(false);
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
            <div className="min-h-screen bg-[#f8f6f1] p-4 transition-colors duration-300 dark:bg-[#0F0D0B] sm:p-6 lg:p-8">
                {showMessage && errors.balance && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-400">
                        {errors.balance}
                    </div>
                )}
                {showMessage && errors.goal && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-400">
                        {errors.goal}
                    </div>
                )}
                {showMessage && errors.account && (
                    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-900/20 dark:text-red-400">
                        {errors.account}
                    </div>
                )}
                {showMessage && flash.success && (
                    <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm font-medium text-orange-700 dark:border-orange-500/30 dark:bg-orange-900/20 dark:text-orange-400">
                        {flash.success}
                    </div>
                )}

                <div className="mb-8 animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-[#f8f6f1] dark:from-orange-900/15 dark:to-[#7a2800]/10">
                            <Target className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-[#1f1a17] dark:text-white">
                                Savings Center
                            </h1>
                            <p className="mt-0.5 text-sm text-[#1f1a17]/60 dark:text-white/60">
                                Manage goals, challenges, and group savings
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-orange-600 dark:text-orange-400 mb-4">
                        <Check className="h-4 w-4" /> Secure saving solutions
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={openChooseType}
                            className="rounded-xl bg-orange-600 px-6 py-3 font-bold text-white hover:bg-[#7a2800] transition-all duration-300 cursor-pointer"
                        >
                            + New Goal
                        </button>
                        <button
                            onClick={() => setJoinGroupModal(true)}
                            className="rounded-xl border-2 border-orange-600 bg-white px-6 py-3 font-bold text-orange-600 hover:bg-orange-50 transition-all duration-300 dark:bg-[#1A1714] dark:border-orange-500 dark:text-orange-400 dark:hover:bg-orange-900/10"
                        >
                            Join Group Saving
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <section className="space-y-6 lg:col-span-2">
                        <div className="fintech-card rounded-3xl border border-orange-100/60 bg-white p-8 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-extrabold tracking-tight text-[#1f1a17] dark:text-white">
                                        Saving Goals
                                    </h2>
                                    <p className="mt-1 text-sm text-[#1f1a17]/60 dark:text-white/60">Track your financial targets</p>
                                </div>
                                <button
                                    onClick={openChooseType}
                                    className="text-sm font-bold text-orange-600 cursor-pointer hover:text-[#7a2800] dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                                >
                                    + Create Goal
                                </button>
                            </div>

                            <div className="space-y-4" id="goals-list">
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
                                                          'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
                                                  }
                                                : progress >= 80
                                                  ? {
                                                        text: 'Almost there! You are close to your goal 🔥',
                                                        className:
                                                            'bg-orange-50 text-[#7a2800] border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
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
                                                className="fintech-card rounded-3xl border border-orange-100/60 bg-white p-6 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]"
                                            >
                                                <span className="inline-block rounded-full bg-orange-50 dark:bg-orange-900/20 px-3 py-1 text-xs font-bold text-orange-700 dark:text-orange-300 dark:text-orange-400 mb-3">
                                                    {typeBadge}
                                                </span>

                                                <div className="mb-3 flex items-center justify-between">
                                                    <h3 className="font-bold text-[#1f1a17] dark:text-white">
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
                                                                className="rounded-xl bg-orange-50 dark:bg-orange-900/20 p-2.5 text-orange-600 dark:text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30 disabled:opacity-40 transition-colors"
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
                                                                className="rounded-xl bg-orange-50 dark:bg-orange-900/20 p-2.5 text-orange-600 dark:text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30 disabled:opacity-40 transition-colors"
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
                                                                className="rounded-xl bg-orange-50 dark:bg-orange-900/20 p-2 text-orange-600 dark:text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30 disabled:opacity-40 transition-colors text-lg"
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
                                                            className={`rounded-xl p-2.5 transition-colors ${
                                                                goal.status ===
                                                                'paused'
                                                                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                                                    : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30'
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
                                                            className="rounded-xl bg-red-50 dark:bg-red-900/20 p-2.5 text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mb-4 h-3 rounded-full bg-orange-100/60 dark:bg-[#7a2800]/20">
                                                    <div
                                                        className="h-3 rounded-full bg-orange-600"
                                                        style={{
                                                            width: `${progress}%`,
                                                        }}
                                                    />
                                                </div>

                                                {goalMessage && (
                                                    <div
                                                        className={`mb-4 rounded-2xl border p-3 text-sm font-medium ${
                                                            progress >= 100
                                                                ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-500/30'
                                                                : progress >= 80
                                                                  ? 'bg-orange-50 text-[#7a2800] border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-500/30'
                                                                  : goalMessage.className
                                                        }`}
                                                    >
                                                        {goalMessage.text}
                                                    </div>
                                                )}

                                                <div className="mb-4 flex justify-between text-sm text-[#1f1a17]/70 dark:text-white/70">
                                                    <span className="font-medium">
                                                        {saved.toFixed(2)} MAD
                                                    </span>
                                                    <span className="font-medium">
                                                        of {target.toFixed(2)}{' '}
                                                        MAD
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="rounded-2xl border border-orange-200/60 bg-orange-50 p-3 dark:border-orange-900/30 dark:bg-orange-900/10">
                                                        <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                                                            Daily Amount
                                                        </p>
                                                        <p className="font-bold text-orange-700 dark:text-orange-300 mt-1">
                                                            {dailyAmount} MAD
                                                        </p>
                                                    </div>
                                                    <div className="rounded-2xl border border-orange-200/60 bg-[#f8f6f1] p-3 dark:border-[#2A2520] dark:bg-white/5">
                                                        <p className="text-xs font-semibold text-[#1f1a17]/70 dark:text-white/70">
                                                            Days Left
                                                        </p>
                                                        <p className="font-bold text-[#1f1a17] dark:text-white mt-1">
                                                            {daysLeft}
                                                        </p>
                                                    </div>
                                                    <div className="rounded-2xl border border-[#7a2800]/20 bg-gradient-to-br from-[#7a2800]/5 to-orange-500/5 p-3 dark:border-[#7a2800] dark:from-[#7a2800]/20 dark:to-orange-900/20">
                                                        <p className="text-xs font-semibold text-[#7a2800] dark:text-orange-400">
                                                            Status
                                                        </p>
                                                        <p className="font-bold text-[#7a2800] dark:text-orange-400 mt-1">
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
                                    <p className="text-sm text-[#1f1a17]/60 dark:text-white/60">
                                        No saving goals yet.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <aside className="space-y-6">
                        <div className="fintech-card rounded-3xl border border-orange-100/60 bg-white p-8 shadow-sm dark:border-[#2A2520] dark:bg-[#1A1714]">
                            <div className="mb-6 flex items-start gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-[#f8f6f1] flex-shrink-0 dark:from-orange-900/15 dark:to-[#7a2800]/10">
                                    <Lightbulb className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#1f1a17] dark:text-white">
                                        Smart Goal Suggestions
                                    </h2>
                                    <p className="text-xs text-[#1f1a17]/60 dark:text-white/60 mt-1">
                                        Personalized ideas to reach your goals faster
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="rounded-2xl border border-orange-100/60 bg-gradient-to-br from-[#f8f6f1] to-orange-50/50 dark:border-[#2A2520] dark:from-orange-900/10 dark:to-[#7a2800]/5 p-4">
                                    <p className="text-sm text-[#1f1a17] dark:text-white">
                                        💡 Save a small amount daily to make progress consistent.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-orange-100/60 bg-gradient-to-br from-[#f8f6f1] to-orange-50/50 dark:border-[#2A2520] dark:from-orange-900/10 dark:to-[#7a2800]/5 p-4">
                                    <p className="text-sm text-[#1f1a17] dark:text-white">
                                        📊 Split big goals into weekly milestones.
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-orange-100/60 bg-gradient-to-br from-[#f8f6f1] to-orange-50/50 dark:border-[#2A2520] dark:from-orange-900/10 dark:to-[#7a2800]/5 p-4">
                                    <p className="text-sm text-[#1f1a17] dark:text-white">
                                        👥 Join a saving challenge with users who have similar goals.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowSavingTypeModal(true);
                                }}
                                className="w-full rounded-2xl bg-orange-600 py-3 font-bold text-white hover:bg-[#7a2800] transition-all duration-300"
                            >
                                Explore Suggestions
                            </button>
                        </div>
                    </aside>
                    {showSavingTypeModal && (
                        <ChooseSavingTypeModal
                            onClose={() => setShowSavingTypeModal(false)}
                            onSelect={(type) => {
                                setShowSavingTypeModal(false);
                                handleTypeSelect(type);
                            }}
                        />
                    )}
                </div>

                {pendingInvitations.length > 0 && (
                    <InvitationsSection invitations={pendingInvitations} />
                )}

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
            color: 'border-orange-200 dark:border-orange-900/30 hover:bg-orange-50 dark:hover:bg-orange-900/10',
            badge: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
        },
        {
            key: 'challenge',
            emoji: '🏆',
            label: 'Saving Challenge',
            desc: 'Manually add progress to challenge yourself to save more.',
            color: 'border-[#7a2800]/20 dark:border-[#7a2800] hover:bg-orange-50 dark:hover:bg-orange-900/10',
            badge: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
        },
        // {
        //     key: 'smart_suggestion',
        //     emoji: '🧠',
        //     label: 'Smart Saving',
        //     desc: 'Get AI-powered suggestions based on your spending habits.',
        //     color: 'border-blue-200 hover:bg-blue-50',
        //     badge: 'bg-blue-100 text-[#7a2800]/80 dark:text-orange-300/80',
        // },
        {
            key: 'group_saving',
            emoji: '👥',
            label: 'Group Saving',
            desc: 'Save together with friends or family in a shared group.',
            color: 'border-orange-200 dark:border-orange-900/30 hover:bg-orange-50 dark:hover:bg-orange-900/10',
            badge: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
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
                        className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${t.color}`}
                    >
                        <span
                            className={`mb-2 inline-block rounded-full px-2 py-1 text-xs font-bold ${t.badge}`}
                        >
                            {t.emoji} {t.label}
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400">{t.desc}</p>
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
            className: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
        },
        challenge: {
            label: '🏆 Saving Challenge',
            className: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
        },
        // smart_suggestion: {
        //     label: '🧠 Smart Saving',
        //     className: 'bg-blue-50 text-[#7a2800]/80 dark:text-orange-300/80',
        // },
    }[data.saving_type];

    return (
        <Modal title="Create Saving Goal" onClose={onClose}>
            {typeBadge && (
                <span
                    className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold ${typeBadge.className}`}
                >
                    {typeBadge.label}
                </span>
            )}
            <form onSubmit={submit} className="space-y-5">
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
                <DatePickerInput
                    label="Deadline"
                    value={data.end_date}
                    onChange={(v) => setData('end_date', v)}
                    error={errors.end_date}
                    min={new Date().toISOString().split('T')[0]}
                    placeholder="Choose deadline"
                />
                {estimatedDailyAmount && (
                    <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-50/50 dark:border-orange-900/30 dark:from-orange-900/10 dark:to-orange-900/5 p-4">
                        <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                            Estimated daily saving
                        </p>
                        <p className="mt-2 text-2xl font-bold text-orange-600 dark:text-orange-500">
                            {estimatedDailyAmount} MAD / day
                        </p>
                        <p className="mt-1 text-xs text-orange-700 dark:text-orange-400">
                            Based on your target amount and deadline.
                        </p>
                    </div>
                )}
                <button
                    disabled={processing}
                    className="w-full rounded-2xl bg-orange-600 py-3 font-bold text-white shadow-sm transition-colors duration-300 hover:bg-[#7a2800] disabled:opacity-60"
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
            <form onSubmit={submit} className="space-y-5">
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
                    className="w-full rounded-2xl bg-orange-600 py-3 font-bold text-white shadow-sm transition-colors duration-300 hover:bg-[#7a2800] disabled:opacity-60"
                >
                    {processing ? 'Adding...' : 'Add Progress'}
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
        visibility: 'private',
    });

    function submit(e) {
        e.preventDefault();
        post('/saving-groups', { onSuccess: onClose });
    }

    return (
        <Modal
            title="Create Saving Group"
            subtitle="Set your contribution, members limit, and choose who can join."
            onClose={onClose}
        >
            <form onSubmit={submit} className="space-y-5">
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
                <DatePickerInput
                    label="Start Date"
                    value={data.start_date}
                    onChange={(v) => setData('start_date', v)}
                    error={errors.start_date}
                    min={new Date().toISOString().split('T')[0]}
                    placeholder="Choose start date"
                />
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">
                        Cycle Days
                    </label>
                    <select
                        value={data.cycle_days}
                        onChange={(e) => setData('cycle_days', e.target.value)}
                        className="h-11 w-full rounded-xl border border-[#EDE8E0] px-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 bg-white dark:bg-[#1A1714] dark:border-[#2A2520] dark:text-white"
                    >
                        <option value="7">Every 7 days</option>
                        <option value="15">Every 15 days</option>
                        <option value="30">Every 30 days</option>
                    </select>
                    {errors.cycle_days && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.cycle_days}
                        </p>
                    )}
                </div>
                <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-900 dark:text-white">
                        Group Visibility
                    </label>
                    <div className="space-y-2">
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#EDE8E0] dark:border-[#2A2520] p-3 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                            <input
                                type="radio"
                                name="visibility"
                                value="private"
                                checked={data.visibility === 'private'}
                                onChange={(e) =>
                                    setData('visibility', e.target.value)
                                }
                                className="h-4 w-4 text-orange-600 dark:text-orange-500"
                            />
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                    Private
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400">
                                    Invite users by account number
                                </p>
                            </div>
                        </label>
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#EDE8E0] dark:border-[#2A2520] p-3 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                            <input
                                type="radio"
                                name="visibility"
                                value="public"
                                checked={data.visibility === 'public'}
                                onChange={(e) =>
                                    setData('visibility', e.target.value)
                                }
                                className="h-4 w-4 text-orange-600 dark:text-orange-500"
                            />
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                    Public
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400">
                                    Users can request to join
                                </p>
                            </div>
                        </label>
                    </div>
                    {errors.visibility && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.visibility}
                        </p>
                    )}
                </div>
                {data.amount && data.max_members && (
                    <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-50/50 dark:border-orange-900/30 dark:from-orange-900/10 dark:to-orange-900/5 p-3 text-sm text-orange-700 dark:text-orange-400">
                        Total pot:{' '}
                        <span className="font-bold">{Number(data.amount) * Number(data.max_members)} MAD</span>
                        <br />
                        Minimum required: <span className="font-bold">3000 MAD</span>
                    </div>
                )}
                <button
                    disabled={processing}
                    className="sticky bottom-0 w-full rounded-2xl bg-orange-600 py-3 font-bold text-white shadow-sm transition-colors duration-300 hover:bg-[#7a2800] disabled:opacity-60"
                >
                    {processing ? 'Creating...' : 'Create Group'}
                </button>
            </form>
        </Modal>
    );
}

function InvitationsSection({ invitations = [] }) {
    if (!invitations.length) return null;

    return (
        <div className="mt-8">
            <div className="mb-5">
                <h2 className="text-xl font-bold text-[#1f1a17] dark:text-white">📬 My Invitations</h2>
                <p className="text-sm text-[#1f1a17]/60 dark:text-white/60">Groups you've been invited to join</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {invitations.map((invitation) => (
                    <div
                        key={invitation.id}
                        className="rounded-2xl border border-[#EDE8E0] bg-white p-5 shadow-sm transition-shadow hover:border-orange-200 hover:shadow-md dark:border-[#2A2520] dark:bg-[#1A1714]"
                    >
                        <div className="mb-3">
                            <h3 className="font-bold text-[#1f1a17] dark:text-white">{invitation.group_name}</h3>
                            <p className="mt-1 text-sm text-[#1f1a17]/60 dark:text-white/60">
                                Invited by <span className="font-semibold">{invitation.owner_name}</span>
                            </p>
                        </div>

                        <div className="mb-4 grid grid-cols-2 gap-2">
                            <div className="rounded-xl border border-orange-100 bg-orange-50 p-3 dark:border-[#2A2520] dark:bg-orange-500/10">
                                <p className="text-xs text-orange-600 dark:text-orange-400">Contribution</p>
                                <p className="font-bold text-orange-700 dark:text-orange-300">{invitation.amount} MAD</p>
                            </div>
                            <div className="rounded-xl border border-[#EDE8E0] bg-[#f8f6f1] p-3 dark:border-[#2A2520] dark:bg-white/5">
                                <p className="text-xs text-slate-500 dark:text-slate-400">Members</p>
                                <p className="font-bold text-[#1f1a17] dark:text-white">
                                    {invitation.current_members}/{invitation.max_members}
                                </p>
                            </div>
                        </div>

                        {invitation.start_date && (
                            <p className="mb-3 text-xs text-slate-400 dark:text-slate-500">Start date: {invitation.start_date}</p>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={() => router.post(`/saving-groups/requests/${invitation.id}/accept-invitation`)}
                                className="flex-1 rounded-xl bg-orange-600 py-2 text-sm font-bold text-white transition-colors hover:bg-[#7a2800]"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => router.post(`/saving-groups/requests/${invitation.id}/decline-invitation`)}
                                className="flex-1 rounded-xl border border-[#EDE8E0] bg-white py-2 text-sm font-bold text-[#1f1a17] transition-colors hover:bg-[#f8f6f1] dark:border-[#2A2520] dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                            >
                                Decline
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function GroupsSection({ groups = [], onCreateGroup }) {
    const [copiedId, setCopiedId] = useState(null);
    const [inviteInputs, setInviteInputs] = useState({});

    if (!groups.length) return null;

    const statusBadge = {
        waiting: {
            label: '⏳ Waiting',
            className: 'bg-orange-50 text-[#7a2800] border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
        },
        active: {
            label: '✅ Active',
            className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
        },
        completed: {
            label: '🏁 Completed',
            className: 'bg-[#f8f6f1] text-[#1f1a17]/70 border-[#EDE8E0] dark:bg-white/5 dark:text-white/70 dark:border-[#2A2520]',
        },
        cancelled: {
            label: '❌ Cancelled',
            className: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
        },
    };

    const copyGroupCode = (groupId) => {
        const code = `SG-${groupId}`;
        navigator.clipboard.writeText(code);
        setCopiedId(groupId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleInvite = (groupId) => {
        const accountNumber = inviteInputs[groupId];
        if (!accountNumber) return;

        router.post(
            `/saving-groups/${groupId}/invite`,
            { account_number: accountNumber },
            {
                onSuccess: () => {
                    setInviteInputs({ ...inviteInputs, [groupId]: '' });
                },
            },
        );
    };

    return (
        <div className="mt-8">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1f1a17] dark:text-white">
                    👥 Group Savings
                </h2>
                <button
                    onClick={onCreateGroup}
                    className="text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-500 cursor-pointer"
                >
                    + New Group
                </button>
            </div>

            <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
                {groups.map((group) => {
                    const badge = statusBadge[group.status] ?? statusBadge.waiting;
                    const groupCode =group.group_code;
                    const isOwner = group.is_owner;
                    const isPrivate = group.visibility === 'private';

                    return (
                        <div
                            key={group.id}
                            className="rounded-2xl border border-[#EDE8E0] bg-white p-5 shadow-sm transition-shadow hover:border-orange-200 hover:shadow-md dark:border-[#2A2520] dark:bg-[#1A1714]"
                        >
                            {/* Header */}
                            <div className="mb-3 flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    <h3 className="font-bold text-[#1f1a17] dark:text-white">{group.name}</h3>
                                    <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                                        Every {group.cycle_days} days
                                    </p>
                                </div>
                                <div className="flex mt-1 gap-1">
                                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${badge.className}`}>
                                        {badge.label}
                                    </span>
                                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                                        isPrivate
                                            ? 'bg-[#f8f6f1] text-[#1f1a17]/70 border-[#EDE8E0] dark:bg-white/5 dark:text-white/70 dark:border-[#2A2520]'
                                            : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'
                                    }`}>
                                        {isPrivate ? '🔒 Private' : '🌍 Public'}
                                    </span>
                                </div>
                            </div>

                            {/* Group Code */}
                            <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 p-3 dark:border-orange-500/20 dark:bg-orange-500/10">
                                <p className="mb-1 text-xs font-medium text-orange-600 dark:text-orange-400">Group Code</p>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-lg font-bold text-[#7a2800] dark:text-orange-300">{groupCode}</span>
                                    <button
                                        onClick={() => copyGroupCode(group.id)}
                                        className="rounded-lg bg-orange-100 p-2 text-orange-600 transition-colors hover:bg-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20"
                                        title="Copy code"
                                    >
                                        {copiedId === group.id ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Cancelled alert */}
                            {group.status === 'cancelled' && (
                                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                                    ⚠️ Group cancelled because not enough members joined before the start date.
                                </div>
                            )}

                            {/* Stats grid */}
                            <div className="mb-4 grid grid-cols-2 gap-2">
                                <div className="rounded-xl border border-orange-100 bg-orange-50 p-3 dark:border-[#2A2520] dark:bg-orange-500/10">
                                    <p className="text-xs text-orange-600 dark:text-orange-400">Contribution</p>
                                    <p className="font-bold text-orange-700 dark:text-orange-300">{group.amount} MAD</p>
                                </div>
                                <div className="rounded-xl border border-orange-100 bg-orange-50 p-3 dark:border-orange-500/20 dark:bg-orange-500/10">
                                    <p className="text-xs text-orange-600 dark:text-orange-400">Total Pot</p>
                                    <p className="font-bold text-orange-700 dark:text-orange-300">{group.total_pot} MAD</p>
                                </div>
                                <div className="rounded-xl border border-[#EDE8E0] bg-[#f8f6f1] p-3 dark:border-[#2A2520] dark:bg-white/5">
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Members</p>
                                    <p className="font-bold text-[#1f1a17] dark:text-white">
                                        {group.current_members}/{group.max_members}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-orange-100 bg-orange-50 p-3 dark:border-orange-500/20 dark:bg-orange-500/10">
                                    <p className="text-xs text-orange-600 dark:text-orange-400">Start Date</p>
                                    <p className="text-xs font-bold text-[#7a2800]/80 dark:text-orange-300/80">{group.start_date ?? '—'}</p>
                                </div>
                                <div className="col-span-2 rounded-xl border border-orange-100 bg-orange-50 p-3 dark:border-orange-500/20 dark:bg-orange-500/10">
                                    <p className="text-xs text-orange-600 dark:text-orange-400">Next Draw</p>
                                    <p className="text-xs font-bold text-orange-700 dark:text-orange-300">
                                        {group.next_draw_date ?? 'Waiting to fill'}
                                    </p>
                                </div>
                            </div>

                            {/* Pending Requests (Owner Only) */}
                            {isOwner && group.pending_requests && group.pending_requests.length > 0 && (
                                <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 p-3 dark:border-orange-500/20 dark:bg-orange-500/10">
                                    <p className="mb-2 text-sm font-semibold text-[#7a2800] dark:text-orange-300">📬 Pending Requests</p>
                                    <div className="space-y-2">
                                        {group.pending_requests.map((req) => (
                                            <div key={req.id} className="flex items-center justify-between rounded-lg border border-[#EDE8E0] bg-white p-2 dark:border-[#2A2520] dark:bg-white/5">
                                                <span className="text-sm font-medium text-[#1f1a17]/80 dark:text-white/80">{req.user_name}</span>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => router.post(`/saving-groups/requests/${req.id}/approve`)}
                                                        className="rounded-lg bg-orange-100 p-1.5 text-orange-600 hover:bg-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20"
                                                        title="Accept"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => router.post(`/saving-groups/requests/${req.id}/reject`)}
                                                        className="rounded-lg bg-red-100 p-1.5 text-red-600 hover:bg-red-200 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                                                        title="Reject"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Private Group Invitation (Owner Only) */}
                            {isOwner && isPrivate && group.status === 'waiting' && (
                                <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 p-3 dark:border-orange-500/20 dark:bg-orange-500/10">
                                    <p className="mb-2 text-sm font-semibold text-[#7a2800] dark:text-orange-300">✉️ Invite by Account Number</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={inviteInputs[group.id] || ''}
                                            onChange={(e) => setInviteInputs({ ...inviteInputs, [group.id]: e.target.value })}
                                            placeholder="Account Number"
                                            className="flex-1 rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm text-[#1f1a17] outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-600/10 dark:border-[#2A2520] dark:bg-[#0F0D0B] dark:text-white"
                                        />
                                        <button
                                            onClick={() => handleInvite(group.id)}
                                            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7a2800]"
                                        >
                                            Invite
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Bank guarantee info */}
                            {group.bank_sponsored && (
                                <div className="mb-4 space-y-1 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm dark:border-orange-500/20 dark:bg-orange-500/10">
                                    <p className="font-semibold text-[#7a2800] dark:text-orange-300">🏦 Bank Guarantee: Active</p>
                                    <p className="text-[#7a2800]/80 dark:text-orange-300/80">
                                        Bank Fee: {group.bank_fee_percent}% ({group.bank_fee} MAD)
                                    </p>
                                    <p className="text-[#7a2800]/80 dark:text-orange-300/80">
                                        Winner receives: <span className="font-bold">{group.winner_amount} MAD</span>
                                    </p>
                                </div>
                            )}

                            {/* Rotation / Turn Info */}
                            {group.status === 'active' && group.current_receiver_name && (
                                <div className="mb-4 space-y-1 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm dark:border-orange-500/20 dark:bg-orange-500/10">
                                    <p className="font-semibold text-[#7a2800] dark:text-orange-300">🎯 Current Turn</p>
                                    <p className="text-[#7a2800]/80 dark:text-orange-300/80">
                                        Next receiver: <span className="font-bold">{group.current_receiver_name}</span>
                                    </p>
                                    {group.draw_start_date && (
                                        <p className="text-[#7a2800]/80 dark:text-orange-300/80">Draw started: {group.draw_start_date}</p>
                                    )}
                                    {group.draw_end_date && (
                                        <p className="text-[#7a2800]/80 dark:text-orange-300/80">Draw ends: {group.draw_end_date}</p>
                                    )}
                                    {group.days_remaining !== null && (
                                        <p className="text-[#7a2800]/80 dark:text-orange-300/80">
                                            Days remaining: <span className="font-bold">{group.days_remaining}</span>
                                        </p>
                                    )}
                                </div>
                            )}

                            {group.status === 'active' && !group.current_receiver_name && (
                                <div className="mb-4 rounded-xl border border-[#EDE8E0] bg-[#f8f6f1] p-3 text-sm text-[#1f1a17]/70 dark:border-[#2A2520] dark:bg-white/5 dark:text-white/70">
                                    ⏳ Waiting for draw to start
                                </div>
                            )}

                            {group.status === 'completed' && (
                                <div className="mb-4 rounded-xl border border-[#EDE8E0] bg-[#f8f6f1] p-3 text-sm text-[#1f1a17]/70 dark:border-[#2A2520] dark:bg-white/5 dark:text-white/70">
                                    ✅ All members have received their turn.
                                </div>
                            )}

                            {/* Current winner */}
                            {group.current_winner && (
                                <div className="mb-3 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm dark:border-orange-500/20 dark:bg-orange-500/10">
                                    🏆 <span className="font-semibold text-[#7a2800] dark:text-orange-300">Current winner:</span>{' '}
                                    <span className="text-[#7a2800]/80 dark:text-orange-300/80">{group.current_winner.name}</span>
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
                                                className="flex items-center justify-between rounded-lg border border-[#EDE8E0] bg-[#f8f6f1] px-3 py-1.5 text-sm dark:border-[#2A2520] dark:bg-white/5"
                                            >
                                                <span className="text-[#1f1a17]/80 dark:text-white/80">{m.name}</span>
                                                {m.has_won && <span title="Has won a draw">🏆</span>}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-slate-400">No members yet.</p>
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
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        wasSuccessful,
    } = useForm({ group_code: '' });

    function submitByCode(e) {
        e.preventDefault();
        post('/saving-groups/request-by-code', {
            onSuccess: () => {
                reset('group_code');
                onClose();
            },
        });
    }

    return (
        <Modal title="Join Group Saving" onClose={onClose}>
            <div className="space-y-6 text-[#1f1a17] dark:text-white">
                {/* Join by Group Code */}
                <div className="rounded-3xl border border-orange-200/70 bg-gradient-to-br from-[#f8f6f1] via-white to-orange-50/60 p-5 shadow-sm shadow-orange-900/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-orange-900/5 dark:border-[#7a2800]/40 dark:from-[#1f1a17] dark:via-[#241b16] dark:to-[#2b160b]">
                    <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-sm">
                            🔑
                        </span>
                        <div>
                            <p className="text-lg font-extrabold leading-tight text-[#1f1a17] dark:text-white">
                                Join by Group Code
                            </p>
                            <p className="text-sm text-[#1f1a17]/60 dark:text-white/60">
                                Enter the group code shared by your friend.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submitByCode} className="space-y-3">
                        <div>
                            <input
                                id="group_code_input"
                                type="text"
                                value={data.group_code}
                                onChange={(e) =>
                                    setData('group_code', e.target.value)
                                }
                                placeholder="458741"
                                className={`h-12 w-full rounded-2xl border px-4 text-lg font-semibold text-[#1f1a17] outline-none transition duration-300 placeholder:text-[#1f1a17]/35 focus:ring-4 dark:text-white dark:placeholder:text-white/30 ${
                                    errors.group_code
                                        ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-400/15 dark:bg-red-950/20'
                                        : 'border-orange-200 bg-white/90 focus:border-orange-600 focus:ring-orange-600/15 dark:border-[#7a2800]/50 dark:bg-white/5'
                                }`}
                            />
                            {errors.group_code && (
                                <p className="mt-2 text-xs font-semibold text-red-600">
                                    {errors.group_code}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing || !data.group_code.trim()}
                            className="w-full rounded-2xl bg-orange-600 py-3.5 font-extrabold text-white shadow-sm transition-colors duration-300 hover:bg-[#7a2800] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Sending…' : 'Send Request'}
                        </button>
                    </form>
                </div>

                {/* Separator */}
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-orange-200 dark:to-[#7a2800]/50" />
                    <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#7a2800]/70 dark:text-orange-300/80">
                        Or join a public group
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-orange-200 dark:to-[#7a2800]/50" />
                </div>

                {/* Public Groups List */}
                {groups.length ? (
                    <div className="space-y-4">
                        {groups.map((group) => {
                            const hasPendingRequest =
                                group.user_request_status === 'pending';

                            return (
                                <div
                                    key={group.id}
                                    className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm shadow-orange-900/5 transition duration-300 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md hover:shadow-orange-900/5 dark:border-[#2A2520] dark:bg-[#1A1714]"
                                >
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-lg font-extrabold text-[#1f1a17] dark:text-white">
                                                {group.name}
                                            </h3>
                                            <p className="mt-0.5 text-xs font-medium text-[#1f1a17]/50 dark:text-white/50">
                                                Every {group.cycle_days} days
                                            </p>
                                        </div>

                                        {hasPendingRequest ? (
                                            <span className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-extrabold text-[#7a2800] dark:border-[#7a2800]/40 dark:bg-[#7a2800]/15 dark:text-orange-300">
                                                Pending
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.post(
                                                        `/saving-groups/${group.id}/request-join`,
                                                        {},
                                                        { onSuccess: onClose },
                                                    )
                                                }
                                                className="rounded-2xl bg-orange-600 px-4 py-2 text-sm font-extrabold text-white shadow-md shadow-orange-600/20 transition hover:-translate-y-0.5 hover:bg-[#7a2800]"
                                            >
                                                Request to Join
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
                                        <div className="rounded-2xl border border-orange-100 bg-[#f8f6f1] p-3 dark:border-[#2A2520] dark:bg-white/5">
                                            <p className="text-xs font-semibold text-[#7a2800]/70 dark:text-orange-300/70">
                                                Contribution
                                            </p>
                                            <p className="text-sm font-extrabold text-[#1f1a17] dark:text-white">
                                                {group.amount} MAD
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 dark:border-[#2A2520] dark:bg-[#7a2800]/15">
                                            <p className="text-xs font-semibold text-[#7a2800]/70 dark:text-orange-300/70">
                                                Total Pot
                                            </p>
                                            <p className="text-sm font-extrabold text-[#7a2800] dark:text-orange-300">
                                                {group.total_pot} MAD
                                            </p>
                                        </div>

                                        <div className="rounded-2xl border border-orange-100 bg-[#f8f6f1] p-3 dark:border-[#2A2520] dark:bg-white/5">
                                            <p className="text-xs font-semibold text-[#1f1a17]/50 dark:text-white/50">
                                                Members
                                            </p>
                                            <p className="text-sm font-extrabold text-[#1f1a17] dark:text-white">
                                                {group.current_members}/
                                                {group.max_members}
                                            </p>
                                        </div>
                                    </div>

                                    {group.start_date && (
                                        <p className="mt-3 rounded-2xl bg-[#f8f6f1] px-4 py-2 text-xs font-semibold text-[#1f1a17]/55 dark:bg-white/5 dark:text-white/55">
                                            Start date: {group.start_date}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="rounded-3xl border border-dashed border-orange-200 bg-[#f8f6f1] px-5 py-7 text-center text-sm font-medium leading-6 text-[#1f1a17]/60 dark:border-[#7a2800]/40 dark:bg-white/5 dark:text-white/60">
                        No public groups available right now. You can still join
                        using a group code above.
                    </p>
                )}
            </div>
        </Modal>
    );
}

function Modal({ title, subtitle, onClose, children }) {
    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-[#EDE8E0] bg-white shadow-2xl transition-colors duration-300 dark:border-[#2A2520] dark:bg-[#1A1714] sm:max-w-xl sm:rounded-[2rem]"
            >
                <div className="flex items-start justify-between border-b border-[#EDE8E0] bg-white px-6 py-5 dark:border-[#2A2520] dark:bg-[#1A1714]">
                    <div>
                        <h2 className="text-xl font-black text-[#1f1a17] dark:text-white">
                            {title}
                        </h2>

                        {subtitle && (
                            <p className="mt-1 text-sm text-[#1f1a17]/60 dark:text-white/60">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-10 w-10 place-items-center rounded-full bg-[#f8f6f1] text-xl text-[#1f1a17]/50 transition hover:bg-orange-50 hover:text-[#7a2800] dark:bg-white/5 dark:text-white/50 dark:hover:bg-orange-500/10 dark:hover:text-orange-300"
                    >
                        ×
                    </button>
                </div>

                <div className="overflow-y-auto bg-white px-6 py-5 dark:bg-[#1A1714]">{children}</div>
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
            <label className="mb-2 block text-sm font-medium text-[#1f1a17]/80 dark:text-white/80">
                {label}
            </label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                min={min}
                max={max}
                onChange={(e) => onChange(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#EDE8E0] bg-white px-4 text-[#1f1a17] outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 dark:border-[#2A2520] dark:bg-[#0F0D0B] dark:text-white dark:placeholder:text-white/30"
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function DatePickerInput({
    label,
    value,
    onChange,
    error,
    placeholder = 'Choose date',
    min,
    max,
}) {
    const selectedDate = value ? new Date(value + 'T00:00:00') : null;

    const [open, setOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(
        selectedDate ? selectedDate.getMonth() : new Date().getMonth(),
    );
    const [currentYear, setCurrentYear] = useState(
        selectedDate ? selectedDate.getFullYear() : new Date().getFullYear(),
    );

    const monthName = new Date(currentYear, currentMonth).toLocaleDateString(
        'en-US',
        {
            month: 'long',
            year: 'numeric',
        },
    );

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const previousMonthLastDay = new Date(
        currentYear,
        currentMonth,
        0,
    ).getDate();

    const days = [];

    for (let i = startDay - 1; i >= 0; i--) {
        days.push({
            day: previousMonthLastDay - i,
            current: false,
            date: new Date(
                currentYear,
                currentMonth - 1,
                previousMonthLastDay - i,
            ),
        });
    }

    for (let day = 1; day <= totalDays; day++) {
        days.push({
            day,
            current: true,
            date: new Date(currentYear, currentMonth, day),
        });
    }

    while (days.length < 42) {
        const nextDay = days.length - startDay - totalDays + 1;

        days.push({
            day: nextDay,
            current: false,
            date: new Date(currentYear, currentMonth + 1, nextDay),
        });
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    function displayDate(dateValue) {
        if (!dateValue) return '';

        return new Date(dateValue + 'T00:00:00').toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }

    function isSameDay(dateA, dateB) {
        if (!dateA || !dateB) return false;

        return (
            dateA.getFullYear() === dateB.getFullYear() &&
            dateA.getMonth() === dateB.getMonth() &&
            dateA.getDate() === dateB.getDate()
        );
    }

    function isDisabled(date) {
        const dateString = formatDate(date);

        if (min && dateString < min) return true;
        if (max && dateString > max) return true;

        return false;
    }

    function selectDate(date) {
        if (isDisabled(date)) return;

        onChange(formatDate(date));
        setOpen(false);
    }

    function goPreviousMonth() {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    }

    function goNextMonth() {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    }

    return (
        <div className="relative">
            <label className="mb-2 block text-sm font-medium text-[#1f1a17]/80 dark:text-white/80">
                {label}
            </label>

            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 text-left text-sm font-semibold text-[#1f1a17] outline-none transition hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 dark:bg-[#0F0D0B] dark:text-white ${
                    error
                        ? 'border-red-400'
                        : 'border-[#EDE8E0] dark:border-[#2A2520]'
                }`}
            >
                <span
                    className={
                        value
                            ? 'text-[#1f1a17] dark:text-white'
                            : 'text-[#1f1a17]/35 dark:text-white/30'
                    }
                >
                    {value ? displayDate(value) : placeholder}
                </span>

                <CalendarDays className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </button>

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

            {open && (
                <>
                    <button
                        type="button"
                        aria-label="Close calendar"
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-40 cursor-default"
                    />

                    <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-full max-w-[360px] overflow-hidden rounded-3xl border border-orange-100 bg-white p-4 shadow-2xl shadow-orange-900/15 dark:border-[#7a2800]/40 dark:bg-[#1A1714]">
                        <div className="mb-4 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={goPreviousMonth}
                                className="grid h-10 w-10 place-items-center rounded-2xl text-[#1f1a17]/60 transition hover:bg-orange-50 hover:text-orange-600 dark:text-white/60 dark:hover:bg-orange-500/10 dark:hover:text-orange-300"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            <h3 className="text-sm font-black text-[#1f1a17] dark:text-white">
                                {monthName}
                            </h3>

                            <button
                                type="button"
                                onClick={goNextMonth}
                                className="grid h-10 w-10 place-items-center rounded-2xl text-[#1f1a17]/60 transition hover:bg-orange-50 hover:text-orange-600 dark:text-white/60 dark:hover:bg-orange-500/10 dark:hover:text-orange-300"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mb-2 grid grid-cols-7 gap-1 text-center">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(
                                (day) => (
                                    <div
                                        key={day}
                                        className="py-2 text-xs font-black text-[#1f1a17]/40 dark:text-white/35"
                                    >
                                        {day}
                                    </div>
                                ),
                            )}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {days.map((item, index) => {
                                const selected = isSameDay(
                                    item.date,
                                    selectedDate,
                                );
                                const today = isSameDay(item.date, new Date());
                                const disabled = isDisabled(item.date);

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => selectDate(item.date)}
                                        className={`grid h-10 place-items-center rounded-xl text-sm font-bold transition ${
                                            selected
                                                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/25'
                                                : today
                                                  ? 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300'
                                                  : item.current
                                                    ? 'text-[#1f1a17]/80 hover:bg-orange-50 hover:text-orange-700 dark:text-white/80 dark:hover:bg-orange-500/10 dark:hover:text-orange-300'
                                                    : 'text-[#1f1a17]/25 dark:text-white/20'
                                        } ${
                                            disabled
                                                ? 'cursor-not-allowed opacity-30 hover:bg-transparent hover:text-inherit'
                                                : ''
                                        }`}
                                    >
                                        {item.day}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-orange-100 pt-4 dark:border-white/10">
                            <button
                                type="button"
                                onClick={() => {
                                    onChange('');
                                    setOpen(false);
                                }}
                                className="text-sm font-bold text-[#1f1a17]/45 transition hover:text-red-500 dark:text-white/40"
                            >
                                Clear
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    const today = new Date();

                                    if (isDisabled(today)) return;

                                    onChange(formatDate(today));
                                    setCurrentMonth(today.getMonth());
                                    setCurrentYear(today.getFullYear());
                                    setOpen(false);
                                }}
                                className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition hover:bg-[#7a2800]"
                            >
                                Today
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

